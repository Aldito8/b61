import express from "express";
import { Pool } from "pg";

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use(express.urlencoded({ extended: false }));

app.get("/", home);
app.get("/contact", contact);
app.post("/contact", handleContact);
app.get("/portofolio", portofolio);
app.get("/portofolioDetail/:id", portofolioDetail)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// const startdate = new Date("2025-01-01")
// const enddate = new Date()

// console.log(startdate, enddate)
// console.log(dateDiff(startdate, enddate))

// function dateDiff(firstDate, lastDate) {
//     return (firstDate.getMonth() - lastDate.getMonth())
// }

const db = new Pool({
    user: "postgres",
    password: "pgadmin61",
    host: "localhost",
    port: 5432,
    database: "postgres",
    max: 20,
});

function home(req, res) {
    res.render("index");
}




let contacts = []
let idMessage = 0
async function handleContact(req, res) {
    let { name, email, phone, subject, message } = req.body;

    let getInTouch = {
        id: idMessage += 1,
        name,
        email,
        phone,
        subject,
        message,
    };

    contacts.push(getInTouch);
    // res.render("contact", { contacts })
    const insertQuery = `INSERT INTO human(name) VALUES ('${getInTouch.name}')`;
    const readQuery = `SELECT * FROM human`;
    await db.query(insertQuery);
    const result = await db.query(readQuery);
    console.log(result.rows);
}
function contact(req, res) {
    // accounts.push(account);
    res.render("contact");
}
function portofolio(req, res) {

    res.render("portofolio", { contacts });
}

function portofolioDetail(req, res) {
    let { id } = req.params;
    let result = contacts.find((element) => element.id == id);

    res.render("portofolioDetail", { result });
}