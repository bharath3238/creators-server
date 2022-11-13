const fs = require("fs")
const excelJS = require("exceljs");

const GenerateExcel = async(keys, data) => {
    console.log(keys, data)
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students"); 
    worksheet.columns = keys;
        data.forEach((user) => {
            worksheet.addRow(user); 
            worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };})
        });

    try { 
        const data = await workbook.xlsx.writeFile(`${__dirname + "utils"}/users.xlsx`).then(() => {
            res.send({status: 200,message: "file successfully downloaded",path: `${__dirname + "utils"}/users.xlsx`
        })}
    )}
    catch (err) {    res.send({    status: "error",    message: "Something went wrong",  });  }
}
module.exports = {GenerateExcel}