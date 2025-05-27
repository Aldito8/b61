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
app.post("/portofolio", handlePortofolio);
app.get("/delete/:id", deletePortofolio)
app.get("/editportofolio/:id", editPortofolio)
app.post("/editportofolio/:id", handleEditPortofolio)
app.get("/portofolioDetail/:id", portofolioDetail)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const db = new Pool({
    user: "postgres",
    password: "pgadmin61",
    host: "localhost",
    port: 5432,
    database: "postgres",
    max: 20,
});
// render home
function home(req, res) {
    res.render("index");
}

// render contact
function contact(req, res) {
    res.render("contact");
}

// contact add handler
async function handleContact(req, res) {
    let { name, email, phone, subject, message } = req.body;
    let contact = {
        name,
        email,
        phone,
        subject,
        message,
    };

    const insertQuery = `INSERT INTO message(name, email, phone, subject, message) VALUES ('${contact.name}','${contact.email}','${contact.phone}','${contact.subject}','${contact.message}')`;
    await db.query(insertQuery);
    // const readQuery = `SELECT * FROM message`;
    // const result = await db.query(readQuery);
    // console.log(result.rows);
}

// render portofolio
async function portofolio(req, res) {
    const readQuery = `SELECT * FROM portofolio ORDER BY id`
    const _result = await db.query(readQuery)

    const result = _result.rows.map(item => {
        const _duration = (item.enddate - item.startdate) / (1000 * 60 * 60 * 24 * 30)

        const duration = _duration < 1 ? "less than 1 month" : `${Math.floor(_duration)} month`;
        const date = new Date(item.enddate);
        return {
            ...item,
            year: date.getFullYear(),
            duration: duration,
        };
    });
    res.render("portofolio", { result });
}


// porofolio add handler
async function handlePortofolio(req, res) {
    const nodejsValue = Boolean(req.body.nodejs)
    const reactjsValue = Boolean(req.body.reactjs)
    const typescriptValue = Boolean(req.body.typescript)
    const nextjsValue = Boolean(req.body.nextjs)
    let { nameproject, startdate, enddate, description } = req.body;
    let project = {
        nameproject, startdate, enddate, description, nodejsValue, reactjsValue, typescriptValue, nextjsValue,
    };

    const insertQuery =
        `INSERT INTO portofolio(nameproject, startdate, enddate, description, nodejs, reactjs, typescript, nextjs) VALUES ('${nameproject}', '${project.startdate}', '${project.enddate}', '${project.description}', '${project.nodejsValue}', '${project.reactjsValue}', '${project.typescriptValue}', '${project.nextjsValue}')`;
    await db.query(insertQuery);

    res.redirect("/portofolio");
}

// delete
async function deletePortofolio(req, res) {
    let { id } = req.params;
    const deleteQuery = `DELETE FROM portofolio WHERE id = ${id}`
    await db.query(deleteQuery)
    res.redirect("/portofolio");
}

// portofolio edit
async function editPortofolio(req, res) {
    let { id } = req.params;

    const readQuery = `SELECT * FROM public.portofolio where id = ${id}`
    const result = await db.query(readQuery)

    const startdate = result.rows[0].startdate.toLocaleDateString()

    const [startday, startmonth, startyear] = startdate.split('/')
    const formattedstartdate = `${startyear}-${startmonth}-${startday}`

    const enddate = result.rows[0].enddate.toLocaleDateString()
    const [endday, endmonth, endyear] = enddate.split('/')
    const formattedenddate = `${endyear}-${endmonth}-${endday}`

    const data = {
        id: result.rows[0].id,
        nameproject: result.rows[0].nameproject,
        startdate: formattedstartdate,
        enddate: formattedenddate,
        description: result.rows[0].description,
        nodejs: result.rows[0].nodejs,
        reactjs: result.rows[0].reactjs,
        typescript: result.rows[0].typescript,
        nextjs: result.rows[0].nextjs,
    }

    // const porto = `SELECT * FROM port`
    // const portoresult = await db.query(porto)
    // console.log(portoresult.rows[0].tech[1]);

    res.render("editportofolio", { data })
}

async function handleEditPortofolio(req, res) {
    const { id } = req.params;
    const nodejsValue = Boolean(req.body.nodejs)
    const reactjsValue = Boolean(req.body.reactjs)
    const typescriptValue = Boolean(req.body.typescript)
    const nextjsValue = Boolean(req.body.nextjs)
    let { nameproject, startdate, enddate, description } = req.body;
    let project = {
        nameproject, startdate, enddate, description, nodejsValue, reactjsValue, typescriptValue, nextjsValue,
    };

    const updateQuery =
        `UPDATE portofolio SET nameproject = '${nameproject}', startdate = '${project.startdate}', enddate = '${project.enddate}', description = '${project.description}', nodejs = ${project.nodejsValue}, reactjs = ${project.reactjsValue}, typescript = ${project.typescriptValue}, nextjs = ${project.nextjsValue} WHERE id = '${id}'`;
    await db.query(updateQuery);

    // console.log(project)

    // const updateporto = `
    // UPDATE porto
    // SET projectname = '${nameproject}',
    // tech = jsonb_build_object(
    //     'nextjs', ${project.nextjsValue},
    //     'nodejs', ${project.nodejsValue},
    //     'reacjs', ${project.reactjsValue},
    //     'typescript', ${project.typescriptValue})

    // WHERE id = 1`;


    // await db.query(updateporto);
}

// render portofolio detail
async function portofolioDetail(req, res) {
    const { id } = req.params;

    const readQuery = `SELECT * FROM public.portofolio WHERE id = $1`;
    const result = await db.query(readQuery, [id]);

    const item = result.rows[0];

    const start = new Date(item.startdate);
    const end = new Date(item.enddate);
    const durationInMonths = (end - start) / (1000 * 60 * 60 * 24 * 30);
    const duration = durationInMonths < 1 ? "less than 1 month" : `${Math.floor(durationInMonths)} month`;

    const data = {
        ...item,
        year: end.getFullYear(),
        duration: duration,
        dateStartDuration: formatDateShort(item.startdate),
        dateEndDuration: formatDateShort(item.enddate)
    };

    console.log(data);

    res.render("portofolioDetail", { data });
}
function formatDateShort(dateInput) {
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}