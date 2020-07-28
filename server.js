const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const dateFormat = require('dateformat');
const publicSuggestions = [];

    io.on('connection' , socket => {
        socket.emit('suggestions_update', { suggestions: publicSuggestions });

        socket.on('submit', (data) => {
            try {
                let newDate = dateFormat(new Date(data.date), data.format);

                if (data.share_with_all) {
                    publicSuggestions.push(data.format);
                    socket.broadcast.emit('suggestions_update', { suggestions: publicSuggestions });
                }

                socket.emit('returning_formatted_date', { formatted_date: newDate });
            } catch (e) {
                socket.emit('erro', { error_message: 'A data e/ou formatação inválidas.'});
            }
        })
    });

    server.listen(3000, () => {
       console.log('listening port 3000')
    });
