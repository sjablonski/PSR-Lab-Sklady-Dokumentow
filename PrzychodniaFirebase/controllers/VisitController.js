const firebase = require("firebase");
const { v4: uuidv4 } = require('uuid');

const visit = () => {
    const database = firebase.database();

    const createObject = (input) => {
        let out = {};
        if(input) {
            const tmp = input.split(";");
            out = {
                id: tmp[0],
                name: tmp[1]
            }
        }
        return out;
    }

    return {
        getAllVisit: async(req, res) => {
            try {
                const ref = database.ref("visits");
                const dataOpen = await ref.orderByChild("status").equalTo("open").once("value");
                const dataClose = await ref.orderByChild("status").equalTo("close").once("value");
                const activeVisit = dataOpen.val() ? Object.values(dataOpen.val()) : [];
                const historyVisit = dataClose.val() ? Object.values(dataClose.val()) : [];
                console.log(activeVisit);
                console.log(historyVisit);
                res.render('pages/index', { activeVisit, historyVisit });
            } catch(err) {
                console.error(err.message);
            }
        },
        getHistory: async(req, res) => {
            try {
                const id = req.params.id;
                const data = await database.ref(`visits/${id}`).once("value");
                const visit = data.val();
                res.render('pages/visit-id', { visit });
            } catch(err) {
                console.error(err.message);
            }
        },
        reservationVisitGet: (req, res) => {
            try {
                const id = req.params.id;
                res.render('pages/visit-reservation', {id});
            } catch(err) {
                console.error(err.message);
            }
        },
        reservationVisitPut: async(req, res) => {
            try {
                const id = req.body.id;
                const visit = {
                    status: 'close',
                    patient: {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        description: req.body.description
                    }
                };
                await database.ref(`visits/${id}`).update(visit);
                res.render('pages/success', {success: "Zarezerwowano wizytę"});
            } catch(err) {
                console.error(err.message);
            }
        },
        addVisitGet: async(req, res) => {
            try {
                const id = req.params.id;
                const data = await database.ref(`doctors/${id}`).once("value");
                const doctor = data.val();
                res.render('pages/visit-new', {doctor});
            } catch(err) {
                console.error(err.message);
            }
        },
        addVisitPost: async(req, res) => {
            try {
                const clinic = createObject(req.body.clinic);
                const visit = {
                    id: uuidv4().substr(0,5),
                    date: req.body.date,
                    specialization: req.body.specializations,
                    doctor: {
                        id: req.body.doctorID,
                        name: `${req.body.firstName} ${req.body.lastName}`
                    },
                    type: req.body.type,
                    status: 'open',
                    clinic
                };
                await database.ref(`visits/${visit.id}`).set(visit);
                res.render('pages/success', {success: "Dodano wizytę"});
            } catch(err) {
                console.error(err.message);
            }
        }
    }
};

module.exports = visit;