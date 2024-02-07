const express = require('express');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const multer = require('multer');
const { databaseKoneksi } = require('./config/db.pg');
const moment = require('moment');
const { log } = require('console');
const app = express();
const port = 8082;
var globalData = {}

// template engine ejs
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Konfigurasi multer untuk menyimpan file-file di direktori 'uploads'
const storage = (path) => {
    console.log(path);
    return multer.diskStorage(
        {
        destination: function (req, file, cb) {
            const { keysearch } = req.body 
            // console.log(keysearch);
             cb(null, `${keysearch}`);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }

    });
}
const upload = multer({ storage: storage('./uploads/') });

function ReadFolder(folderPath, callback) {
    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            callback(err);
            return;
        }

        const structure = [];
        const promises = [];
        
        files.forEach(file => {
            const item = {
                text: file.name,
                type: file.isDirectory() ? 'folder' : 'file',
                path: `${path.join(folderPath, file.name)}`,
                children: []
            };
            if (file.isDirectory()) {
                const childFolderPath = path.join(folderPath, file.name);
                promises.push(new Promise((resolve, reject) => {
                    ReadFolder(childFolderPath, (err, childStructure) => {
                        if (!err) {
                            item.children = childStructure;
                            structure.push(item);
                            resolve();
                        } else {
                            reject(err);
                        }
                    });
                }));
            } else {
                structure.push(item);
            }
        });

        Promise.all(promises)
            .then(() => {
                callback(null, structure.reverse());
            })
            .catch(err => {
                callback(err);
            });
    });
}

function ConvertSize(size) {
    let hasil_convert = ''
    if (size < 1024) {
        hasil_convert = `${size} B`
    }else if(size < 1024 * 1024) {
        hasil_convert = `${(size / 1024).toFixed(2)} KB`
    }else if(size < 1024 * 1024 * 1024) {
        hasil_convert = `${(size / (1024 * 1024)).toFixed(2)} MB`
    }else{
        hasil_convert = `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
    }
    return hasil_convert
}


const ListFile = async(keypath) =>{
    const data = await databaseKoneksi.query(`SELECT to_char(ctddate,'YYYY-MM-DD') AS tanggal,nama_file,ukuran FROM tbl_file WHERE path like '%${keypath}/'`)
    return data.rowCount > 0 ? data.rows : []
}



// endpoint home
app.get('/', async(req,res) => {
    res.render('index',{ listfile : [],nama_folder : '', url_path : ''})
})

app.get('/listFolder', async(req,res) => {
    const folderPath = './uploads'; // Ganti dengan path folder Anda
    ReadFolder(folderPath, (err, data) => {
        if (err) {
            res.status(500).send('Gagal memuat struktur folder');
        } else {
            res.json(data);
        }
    });
})

// endpoint show list folder ke dalam table
app.get('/showtable', async(req,res) => {
    const {keysearch,urlpath} = req.query
    const listfile = await ListFile(keysearch)
    res.render('index',{ listfile , nama_folder : keysearch,url_path : `${urlpath}`})
})

app.get('/createFolder', async(req, res) => {
    const {url_folder} = req.query
    if (!fs.existsSync('./uploads/'+url_folder)) {
        fs.mkdirSync('./uploads/'+url_folder)
        console.log(`Directory ${url_folder} is created.`)
    }
    res.redirect('/')
});

// end point untuk proses upload file ke folder dan database
app.post('/upload', upload.array('files[]', 10), async(req, res) => {
    // req.files akan berisi array file-file yang diunggah
    try {
        const data_gambar = req.files
        const generateinserbulk = data_gambar.map(item => `('./${item.destination.replaceAll(/\\/g, '/')}/','${item.originalname}','${ConvertSize(item.size)}','${moment().format("YYYY-MM-DD")}')`)
        await databaseKoneksi.query(`INSERT INTO tbl_file(path,nama_file,ukuran,ctddate) VALUES ${generateinserbulk.join(',')};`)
        const key = data_gambar[0].destination.match(/[^\\]+$/)[0]
        res.redirect(`/showtable?keysearch=${key}&urlpath=${data_gambar[0].destination}`)
    } catch (error) {
        console.log(error); 
    }
    // res.redirect(`/showtable?keysearch=${}`)
});

// endpoint download file
app.get('/download', (req, res) => {
    const {files} = req.query
    const listfile = files.split(',')

    if (listfile.length > 1) {
// melakukan dispatch masing-masing file dan memindahkan ke file archiver
    const archive = archiver('zip');
    res.attachment('files.zip');
    archive.pipe(res);
    listfile.forEach(file => {
        const filePath = path.join(__dirname + `/uploads/folder 1/`, file);
        if (fs.existsSync(filePath)) {
            archive.file(filePath, { name: file });
        } else {
            console.error(`File ${filePath} tidak ditemukan.`);
        }
    });
    archive.finalize();
    }else{
// download satu file
        const filePath = path.join(__dirname + `/uploads/folder 1/`+files);
        if (fs.existsSync(filePath)) {
            // Mengirimkan file sebagai respons
            res.download(filePath, path.basename(filePath), (err) => {
                if (err) {
                    // Tangani kesalahan jika ada
                    console.error('Gagal mengirim file:', err);
                    res.status(500).send('Gagal mengirim file');
                } else {
                    console.log('File berhasil dikirim');
                }
            });
        } else {
            res.status(404).send('File tidak ditemukan');
        }
    }

});

app.get('/deleted', async(req,res) => {
    const deletefile = req.query.files.split(',')
    const url_path = req.query.urlpath
    deletefile.forEach(file => {
        const filePath = path.join(__dirname + `/${url_path.replaceAll(/\\/g, '/')}/`+file);
        fs.unlink(filePath,(err) => {
            if (err) {
                console.error(`Gagal menghapus file ${file}:`, err);
            } else {
                console.log(`File ${file} berhasil dihapus`);
            }
        })
    })
    await databaseKoneksi.query(`DELETE FROM tbl_file WHERE nama_file IN(${deletefile.map(item => `'${item}'`).join(',')})`)
    res.redirect('/')
})


// app.use('/', (req,res) => {
//     res.status = 404;
//     res.send('Halaman tidak tersedia');
// })


app.listen(port, () =>{
    console.log(`Server telah silahkan akses ke http://localhost:${port}`);
})