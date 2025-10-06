const DatabaseHelper = require('../../util/databaseHelper');
const { AlarmReport, AlarmCategory } = require('../../model');
const { Op, Sequelize } = require('sequelize');

const AlarmReportHelper = new DatabaseHelper(AlarmReport);

const insertAlarmReport = async(data)=>{
  return await AlarmReportHelper.create(data)
}

const updateAlarmReport = async(data)=>{
  return await AlarmReportHelper.update(data)
}

const deleteAlarmReport = async(id)=>{
  return await AlarmReportHelper.delete(id)
}

const getAlarmReport = async(id)=>{
  return await AlarmReportHelper.findByPk(id);
}

const getAlarmReports = async()=>{
  return await AlarmReportHelper.findAll();
}

const getAlarmReportsWithCategories = async(params) => {
  try {
    const { 
      criteria = {}, 
      start_date, 
      end_date, 
      order = [['createdAt', 'DESC']], 
      limit, 
      offset 
    } = params;
    
    // Create the base query options
    const queryOptions = {
      criteria: { ...criteria },
      include: [{
        model: AlarmCategory, // Make sure this matches your model name
        required: false
      }],
      order,
      limit,
      offset,
      raw: false,           // Set to false to get proper nested objects
      nest: true            // Set to true to properly nest the includes
    };
    
    // If date range is provided, add it to criteria
    if (start_date && end_date) {
      queryOptions.criteria.createdAt = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }
    
    // Use the find method from your DatabaseHelper
    return await AlarmReportHelper.find(queryOptions);
  } catch (error) {
    console.error("Error in getAlarmReportsWithCategories:", error);
    throw error;
  }
}

const getAlarmSummaryByCategory = async(start_date, end_date) => {
  try {
    const result = await AlarmReport.findAll({
      attributes: [
        'category_id',
        [Sequelize.literal('SUM(total_count)::integer'), 'total_count'] 
      ],
      where: {
        createdAt: {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        },
        category_id: {
          [Op.notIn]: [0, 3] // Exclude category_id 0 and 3
        }
      },
      include: [{
        model: AlarmCategory,
        required: false,
        attributes: ['category_name', 'subcategory_name', 'message', 'is_failure', 'source_type']
      }],
      group: [Sequelize.literal('"AlarmReport"."category_id"'), 'AlarmCategory.category_id'],
      order: [[Sequelize.literal('"AlarmReport"."category_id"'), 'ASC']],
      raw: false,
      nest: true
    });
    
    return result;
  } catch (error) {
    console.error("Error in getAlarmSummaryByCategory:", error);
    throw error;
  }
};

module.exports = {
  insertAlarmReport,
  updateAlarmReport,
  deleteAlarmReport,
  getAlarmReport,
  getAlarmReports,
  getAlarmReportsWithCategories,
  getAlarmSummaryByCategory
}