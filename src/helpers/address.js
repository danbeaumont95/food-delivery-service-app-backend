const postcodes = require('node-postcodes.io');
const geolib = require('geolib');
const conversions = require('conversions');

const getLatLongFromPostCode = async (postcode) => {
  const address = await postcodes.lookup(postcode);
  const {
    result: {
      latitude, longitude
    }
  } = address;
  return { latitude, longitude };
};

const getDifferenceBetween2Addresses = (address1, address2) => {
  // originally returns meters, conversions func turns to miles
  const miles = conversions(test2, 'metres', 'miles').toFixed(2);

  return miles;
};

module.exports = {
  getLatLongFromPostCode,
  getDifferenceBetween2Addresses
};