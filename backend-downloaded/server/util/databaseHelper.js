const { Device, SensorType, CalRule } = require("../model");

class DatabaseHelper {
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    return this.model.findAll({ raw: true });
  }

  async findByPk(id) {
    return this.model.findByPk(parseInt(id, 10));
  }

  async count(criteria = {}) {
    if (Object.keys(criteria).length === 0) {
      console.info("No criteria provided, counting all records.");
      return await this.model.count();
    } else {
      return await this.model.count({
        where: criteria
      });
    }
  }

  async create(data) {
    return this.model.create(data);
  }

  async bulkCreate(data) {
    return this.model.bulkCreate(data);
  }

  async update(id, data) {
    const instance = await this.model.findByPk(parseInt(id, 10));
    if (!instance) {
      throw new Error('Record not found');
    }
    return instance.update(data);
  }

  async updateByKey(key, value, data) {
    const instance = await this.model.findOne({
      where: { [key]: value }
    });
    return instance.update(data);
  }

  async delete(id) {
    const instance = await this.model.findByPk(parseInt(id, 10));
    if (!instance) {
      throw new Error('Record not found');
    }
    return instance.destroy();
  }

  async deleteAll(ids) {
    return await this.model.destroy({
      where: {
        id: ids,
      },
    });
  }

  async findByCriteria(criteria, options = null) {
    try {
      if (criteria && options && options.length > 0) {
        return await this.model.findAll({ ...criteria, include: options, raw: true });
      } else if (options && options.length > 0) {
        return await this.model.findAll({ include: options });
      } else {
        return await this.model.findAll({ ...criteria });
      }
    } catch (error) {
      console.error("Error in findByCriteria:", error);
      throw error;
    }
  }

  async findByCriteriaSpecial(criteria, options = null) {
    try {
      return await this.model.findAll({
        undefined, include: [
          {
            model: Device,
            required: false,
          },
          {
            model: SensorType,
            required: false,
          },
          {
            model: CalRule,
            required: false,
          }
        ]
      });
    } catch (error) {
      console.error("Error in findByCriteria:", error);
      throw error;
    }
  }

  async getUniqueColumnCount(column_id) {
    try {
      const count = await this.model.count({
        distinct: true,
        col: column_id,
      });
      return count;
    } catch (error) {
      console.error("Error in getUniqueColumnCount:", error);
      throw error;
    }
  }

  async findOne(criteria = {}) {
    try {
      return await this.model.findOne({
        where: criteria,
        raw: true,
      });
    } catch (error) {
      console.error("Error in findOne:", error);
      throw error;
    }
  }


  /**
   * Find records with flexible filter options
   * 
   * @param {Object} params - Query parameters object
   * @param {Object} params.criteria - Filter criteria (where conditions)
   * @param {Array|Object} params.include - Models to include
   * @param {Array} params.order - Order specifications
   * @param {Number} params.limit - Limit results
   * @param {Number} params.offset - Offset for pagination
   * @param {Array|Object} params.attributes - Attributes to select
   * @param {Boolean} params.raw - Return plain objects (default: true)
   * @returns {Promise<Array>} - Query results
   */
  async find(params = {}) {
    try {

      console.info("Received params:", JSON.stringify(params));

      // Extract and process all possible parameters
      const {
        criteria = {},
        include,
        order,
        limit,
        offset,
        attributes,
        nest = false,
        group
      } = params;


      console.info("Extracted criteria:", JSON.stringify(criteria));
      // Build the query options
      const queryOptions = {
        where: criteria,
        raw: true,
        nest: true
      };

      // Add optional parameters if they exist
      if (include) queryOptions.include = include;
      if (order) queryOptions.order = order;
      if (limit) queryOptions.limit = limit;
      if (offset) queryOptions.offset = offset;
      if (attributes) queryOptions.attributes = attributes;
      if (group) queryOptions.group = group;
      console.info("Query options:", queryOptions);
      // Execute the query
      return this.model.findAll(queryOptions);
    } catch (error) {
      console.error(`Error in ${this.model.name}.find:`, error);
      throw error;
    }
  }

}



module.exports = DatabaseHelper;