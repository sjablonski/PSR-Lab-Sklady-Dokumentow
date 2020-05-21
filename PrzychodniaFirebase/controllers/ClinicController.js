const firebase = require("firebase");
const { v4: uuidv4 } = require('uuid');

const clinic = () => {
    const database = firebase.database();

    const createArray = (input) => {
        let out = [];
        if(input) {
            const arr = Array.isArray(input) ? input : [input];
            out = arr.map(item => {
                const tmp = item.split(";");
                return {
                    id: tmp[0],
                    name: tmp[1]
                }
            });
        }
        return out;
    }

    const updateDoctors = async(clinic, doctors) => {
        if(doctors.length) {
            for (const doctor of doctors) {
                const clinicsRef = database.ref(`doctors/${doctor.id}/clinics`);
                const data = await clinicsRef.once("value");
                let clinics = data.val() ? Object.values(data.val()) : [];
                clinics = clinics.filter(item => {
                    return item.id !== id;
                });
                await clinicsRef.set([...clinics, clinic]);
            }
        }
    }

    return {
        getAllClinics: async(req, res) => {
            try {
                const data = await database.ref("clinics").once("value");
                const clinics = data.val() ? Object.values(data.val()) : [];
                res.render('pages/clinic', { clinics });
            } catch(err) {
                console.error(err.message);
            }
        },
        getSingleClinic: async (req, res) => {
            try {
                const id = req.params.id;
                const dataC = await database.ref(`clinics/${id}`).once("value");
                const dataD = await database.ref("doctors").once("value");
                const clinic = dataC.val();
                const doctors = dataD.val() ? Object.values(dataD.val()) : [];
                res.render('pages/clinic-id', {clinic, doctors});
            } catch(err) {
                console.error(err.message);
            }
        },
        addClinicGet: async(req, res) => {
            try {
                const data = await database.ref("doctors").once("value");
                const doctors = data.val() ? Object.values(data.val()) : [];
                res.render('pages/clinic-new', { doctors });
            } catch(err) {
                console.error(err.message);
            }
        },
        addClinicPost: async(req, res) => {
            try {
                const doctors = createArray(req.body.doctors);
                const clinic = {
                    id: uuidv4().substr(0,5),
                    name: req.body.clinicName,
                    location: req.body.location,
                    phone: req.body.phone,
                    nip: req.body.nip,
                    doctors
                };
                await database.ref(`clinics/${clinic.id}`).set(clinic);
                await updateDoctors({id: clinic.id, name: clinic.name}, doctors);
                res.render('pages/success', {success: "Dodano nową przychodnię"});
            } catch(err) {
                console.error(err.message);
            }
        },
        updateClinic: async(req, res) => {
            try {
                const id = req.body.id;
                const doctors = createArray(req.body.doctors);
                const clinic = {
                    name: req.body.clinicName,
                    location: req.body.location,
                    phone: req.body.phone,
                    nip: req.body.nip,
                    doctors
                };
                await database.ref(`clinics/${id}`).update(clinic);
                await updateDoctors({id, name: clinic.name}, doctors);
                res.render('pages/success', {success: "Zaktualizowano przychodnię"});
            } catch(err) {
                console.error(err.message);
            }
        },
        deleteClinic: async(req, res) => {
            try {
                const id = req.body.id;
                const doctorsRef = database.ref(`clinics/${id}/doctors`);
                const data = await doctorsRef.once("value");
                const doctors = data.val() ? Object.values(data.val()) : [];
                for(const doctor of doctors) {
                    const clinicsRef = database.ref(`doctors/${doctor.id}/clinics`);
                    const data = await clinicsRef.once("value");
                    let clinics = data.val() ? Object.values(data.val()) : [];
                    clinics = clinics.filter(item => {
                       return item.id !== id;
                    });
                    await clinicsRef.set(clinics);
                }
                await database.ref(`clinics/${id}`).remove();

                res.render('pages/success', {success: "Usunięto przychodnię"});
            } catch(err) {
                console.error(err.message);
            }
        }
    }
}

module.exports = clinic;