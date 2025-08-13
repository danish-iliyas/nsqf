import State from "../models/State.js";
import District from "../models/District.js";
import  City  from "../models/City.js";

// ✅ Add State
export const addState = async (req, res) => {
  try {
    // Role check
    console.log("User role:", req.user.role);
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add states" });
    }

    const { stateName } = req.body;
    console.log("Adding state:", stateName);

    // Validation
    if (!stateName ) {
      return res.status(400).json({ message: "Name and code are required" });
    }
    // Check if state already exists
    const existingState = await State.findOne({ where: { stateName } });
    if (existingState) {
      return res.status(400).json({ message: "State already exists" });
    }

    // Create
    const state = await State.create({ stateName });

    res.status(201).json({ message: "State added successfully", state });
  } catch (error) {
    res.status(500).json({ message: "Error adding state", error: error.message });
  }
};

// ✅ Add District
export const addDistrict = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add districts" });
    }

    const { name, pincode, stateId } = req.body;

    if (!name || !pincode || !stateId) {
      return res.status(400).json({ message: "Name, pincode, and stateId are required" });
    }

    // Check if state exists
    const state = await State.findByPk(stateId);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const district = await District.create({ name, pincode, stateId });

    res.status(201).json({ message: "District added successfully", district });
  } catch (error) {
    res.status(500).json({ message: "Error adding district", error: error.message });
  }
};

// ✅ Add City
export const addCity = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add cities" });
    } 
    const { name, pincode, districtId } = req.body;

    if (!name || !pincode || !districtId) {
      return res.status(400).json({ message: "Name, pincode, and districtId are required" });
    } 
    // Check if district exists
    const district = await District.findByPk(districtId);
    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }
    const city = await City.create({ name, pincode, districtId });

    res.status(201).json({ message: "City added successfully", city });
  } catch (error) {
    res.status(500).json({ message: "Error adding city", error: error.message });
  }
};

// ✅ Get all States
export const getAllStates = async (req, res) => {
  try {
    const states = await State.findAll();
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: "Error fetching states", error: error.message });
  }
};


// ✅ Get all Districts by State ID
export const getDistrictsByState = async (req, res) => {
  try {
    const { stateId } = req.params;

    if (!stateId) {
      return res.status(400).json({ message: "stateId is required" });
    }

    // Check if state exists
    const state = await State.findByPk(stateId);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    const districts = await District.findAll({
      where: { stateId },
      include: [
        {
          model: City,
          as: "cities", // make sure relation alias matches your association
          attributes: ["id", "name", "pincode"]
        }
      ],
      attributes: ["id", "name", "pincode"]
    });

    res.json({ state: state.name, districts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching districts", error: error.message });
  }
};


// ✅ Get all Cities by District ID
export const getCitiesByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;

    if (!districtId) {
      return res.status(400).json({ message: "districtId is required" });
    }

    // Check if district exists
    const district = await District.findByPk(districtId);
    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    const cities = await City.findAll({
      where: { districtId },
      attributes: ["id", "name", "pincode"]
    });

    res.json({ district: district.name, cities });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities", error: error.message });
  }
};


// ✅ Get all schools with full hierarchy
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.findAll({
      include: [
        { model: State, as: "state", attributes: ["id", "name", "code"] },
        { model: District, as: "district", attributes: ["id", "name", "pincode"] },
        { model: City, as: "city", attributes: ["id", "name", "pincode"] }
      ],
      order: [["id", "ASC"]]
    });

    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools", error: error.message });
  }
};