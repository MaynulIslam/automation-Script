const common = require("../../util/common");
const constant = require("../../util/constant");
const gasCalDataDAL = require("./gascaldata.helper");

const getCalibrationHistory = async (serial_number) => {
    const calibrationHistory = await gasCalDataDAL.findAll({
      where: {
        serial_number: serial_number
      },
      attributes: [
        'createdAt', // This will be your timestamp
        ['local_board', 'location'], // Maps local_board to location in response
        ['id', 'calibration_name'], // Using id as calibration name, or you could create a specific format
        'adc_factory_zero',
        'adc_factory_span',
        'adc_field_zero',
        'adc_field_span',
        'temperature' // Could be used as humidity or add a humidity field if needed
      ],
      order: [
        ['createdAt', 'ASC']
      ]
    });
  
    // Transform the data to match your desired format
    return calibrationHistory.map((cal, index) => ({
      timestamp: cal.createdAt,
      location: cal.local_board,
      calibration_name: `Calibration ${index + 1}`,
      adc_factory_zero: cal.adc_factory_zero,
      adc_factory_span: cal.adc_factory_span,
      adc_field_zero: cal.adc_field_zero,
      adc_field_span: cal.adc_field_span,
      humidity: cal.temperature // Using temperature as humidity or add proper field
    }));
  };

exports.getSensorCalData = async (req, res) => {
    try {
        try {
            const calibrationHistory = await getCalibrationHistory(req.params.serial_number);
            res.json(calibrationHistory);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    } catch (error) {
        console.error('Error getting host ID:', error);
    }
};