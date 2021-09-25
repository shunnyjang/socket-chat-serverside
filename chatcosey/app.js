const express = require('express');
const app = express();

// Setup CORS
app.use(require('cors'));

app.use("/user", require("./routes/user"));
app.use("/chatroom", require("./routes/chatroom"));

app.get('/', (req, res) => {
    res.json({
        success: true
    });
    console.log("Hello Express");
});

// Setup Error Handlers
const errorHandlers = require("./handlers/errorHandlers");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongooseError);
if (process.env.ENV === "DEVELOPMENT")
    app.use(errorHandlers.developmentErrors);
else
    app.use(errorHandlers.productionErrors);

module.exports = app;
