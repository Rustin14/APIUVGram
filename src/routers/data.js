const { getAllEducationalProgram, getAllFacultyAvailables, getAllRegion, addNewEducationalProgramToFaculty, addNewFacultyToRegion, addNewRegion } = require('../controllers/educationalProgramController');

const router = require('express').Router();

router.get("/data/faculty/",
    getAllFacultyAvailables
);

router.get("/data/educationalprogram/",
    getAllEducationalProgram
);

router.get("/data/region/",
    getAllRegion
);

// ADD IN LATER VERSION AUTH ADMIN ROLE FOR THIS ROUTES
router.post("/data/faculty",
    addNewFacultyToRegion
);

// ADD IN LATER VERSION AUTH ADMIN ROLE FOR THIS ROUTES
router.post("/data/region",
    addNewRegion
);

// ADD IN LATER VERSION AUTH ADMIN ROLE FOR THIS ROUTES
router.post("/data/educationalprogram",
    addNewEducationalProgramToFaculty
);


module.exports = router;