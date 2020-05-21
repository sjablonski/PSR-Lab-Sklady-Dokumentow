const firebase = require("firebase");
const { v4: uuidv4 } = require('uuid');

const doctor = () => {
    const database = firebase.database();

    return {
        getAllDoctors: async(req, res) => {
            try {
                const data = await database.ref("doctors").once("value");
                const doctors = data.val() ? Object.values(data.val()) : [];
                res.render('pages/doctor', { doctors });
            } catch(err) {
                console.error(err.message);
            }
        },
        getSingleDoctor: async(req, res) => {
            try {
                const id = req.params.id;
                const data = await database.ref(`doctors/${id}`).once("value");
                const doctor = data.val();
                res.render('pages/doctor-id', { doctor });
            } catch(err) {
                console.error(err.message);
            }
        },
        addDoctorGet: (req, res) => {
            try {
                res.render('pages/doctor-new');
            } catch(err) {
                console.error(err.message);
            }
        },
        addDoctorPost: async(req, res) => {
            try {
                const doctor = {
                    id: uuidv4().substr(0,5),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    specializations: [req.body.specializations]
                };
                await database.ref(`doctors/${doctor.id}`).set(doctor);
                res.render('pages/success', {success: "Dodano lekarza"});
            } catch(err) {
                console.error(err.message);
            }
        },
        updateDoctor: async(req, res) => {
            try {
                const id = req.body.id;
                const doctor = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    specializations: req.body.specializations
                };
                await database.ref(`doctors/${id}`).update(doctor);
                res.render('pages/success', {success: "Zaktualizowano dane o lekarzu"});
            } catch(err) {
                console.error(err.message);
            }
        },
        deleteDoctor: async(req, res) => {
            try {
                const id = req.body.id;
                await database.ref(`doctors/${id}`).remove();
                // await db.collection("clinics").update(
                //     { "doctors.id": id },
                //     { $pull: { 'doctors': { id } } }
                // );
                res.render('pages/success', {success: "Usunięto lekarza"});
            } catch(err) {
                console.error(err.message);
            }
        }
    }
}

module.exports = doctor;