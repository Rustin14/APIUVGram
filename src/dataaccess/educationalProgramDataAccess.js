const { sequelize } = require("../database/connectionDatabaseSequelize");
const { EducationalProgram } = require("../models/EducationalProgram");
const { Faculty } = require("../models/Faculty");
const { Region } = require("../models/Region");

/**
 * Get all educational program available
 * @returns Array with educational programs
 */
const getAllEducationalProgram = async () => {
    let programs = [];
    try {
        programs = await EducationalProgram.findAll({
            raw: true,
            nest: true,
        });
    } catch (error) {
        throw new Error(error);
    }
    return programs;
}

/**
 * Get all Faculties registered
 * @returns Array with faculties
 */
const getAllFacultyAvailables = async () => {
    let faculties = [];
    try {
        faculties = await Faculty.findAll({
            raw: true,
            nest: true
        })
    } catch (error) {
        throw new Error(error);
    }
    return faculties;
}

/**
 * Get all Region registered
 * @returns Array with faculties
 */
const getAllRegion = async () => {
    let region = [];
    try {
        region = await Region.findAll({
            raw: true,
            nest: true,
        })
    } catch (error) {
        throw new Error(error);
    }
    return region;
}

/**
 * Check if a career is registered.
 * @param {*} id the id of career
 * @returns true if it exist otherwise false
 */
const isEducationalProgramRegistered = async (id) => {
    let isRegistered = false;
    try {
        let data = await EducationalProgram.findOne({
            where: {
                id
            }
        });
        isRegistered = (data) ? true : false;
    } catch (error) {
        throw new Error(error);
    }
    return isRegistered;
}

/**
 * Add education program to faculty 
 * @param {*} educational_program educational program or career name
 * @param {*} id_faculty faculto to be added
 * @returns true if was created otherwise false
 */
const addEducationalProgramToFaculty = async (educational_program, id_faculty) => {
    let isRegistered = true;
    const t = await sequelize.transaction();
    try {
        await EducationalProgram.create({
            educational_program,
            id_faculty
        }, { transaction: t });
        await t.commit();
        isRegistered = true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return isRegistered;
}

/**
 * Add faculty to region
 * @param {*} faculty faculty name
 * @param {*} id_region id of region to be added
 * @returns true if was created otherwise false
 */
const addFacultyToRegion = async (faculty, id_region) => {
    let isRegistered = true;
    const t = await sequelize.transaction();
    try {
        await Faculty.create({
            faculty,
            id_region
        }, { transaction: t });
        await t.commit();
        isRegistered = true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return isRegistered;
};

/**
 * Add region to database
 * @param {*} region region name
 * @returns true if created otherwise false
 */
const addRegion = async (region) => {
    let isRegistered = true;
    const t = await sequelize.transaction();
    try {
        await Region.create({
            region,
        }, { transaction: t });
        await t.commit();
        isRegistered = true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return isRegistered;
}

module.exports = { getAllEducationalProgram, getAllFacultyAvailables, getAllRegion, isEducationalProgramRegistered, addRegion, addFacultyToRegion, addEducationalProgramToFaculty }