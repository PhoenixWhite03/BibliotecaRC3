const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3001

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/lend-book', (req, res) => {
	console.log(req.body);

	const fileName = `id_${req.body['user-id']}${req.body['lend-date']}.txt`
	const filePath = path.join(__dirname, 'data', fileName);
	const data = req.body;
	// const content = JSON.stringify(req.body, null, 2);

	Object.values(data).forEach(value => {
		if (value === '') {
			return res.redirect('/error.html');
		}
	})

	const content = `
	===============================
	       PRÉSTAMO DE LIBRO
	===============================

	ID:            ${data['user-id']}
	Nombre:        ${data['user-name']} ${data['user-lastname']}
	Título:        ${data['book-title']}
	Autor:         ${data['book-author']}
	Editorial:     ${data['book-publisher']}
	Año:           ${data['book-year']}
	ISBN:          ${data['book-ISBN']}

	-------------------------------
	Fecha de emisión: ${data['lend-date']}

	Gracias por su solicitud.
	===============================
	`;

	fs.writeFile(filePath, content, (err) => {
    	if (err) {
      		console.error('Error al crear el archivo:', err);
      		return res.status(500).send('Error interno del servidor');
    	}
	});

	res.redirect('/download/' + fileName)
})

app.get('/download/:filename', (req, res) => {
	const filePath = path.join(__dirname, 'data', req.params.filename);

	res.download(filePath, 'resumen.txt', (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
        res.status(500).send('Error al enviar el archivo');
      } else {
        console.log('Archivo enviado exitosamente');
      }
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})