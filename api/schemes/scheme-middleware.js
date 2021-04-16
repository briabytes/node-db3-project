const Scheme = require('./scheme-model');

const checkSchemeId = async (req, res, next) => {
  const { id } = req.params
  try {
    const scheme = await Scheme.findById(id)
    if(scheme) {
      req.scheme = scheme
      next();
    }else {
      res.status(404).json({
        message: `scheme with scheme_id ${id} not found`
      });
    }
  }catch(error) {
    next(error);
  }
}

const validateScheme = async (req, res, next) => {
  const { scheme_name } = req.body
  try {
    if(!scheme_name || scheme_name === '' || typeof(scheme_name) !== 'string') {
      res.status(400).json({
        message: 'invalid scheme_name'
      });
    }else {
      next();
    }
  }catch(error) {
    next(error);
  }
}

const validateStep = async (req, res, next) => {
  const { instructions, step_number } = req.body
  try {
    if(!instructions || instructions === '' || typeof(instructions) !== 'string') {
      res.status(400).json({
        message: 'invalid step'
      });
    }if(!step_number || !parseInt(step_number) || typeof(parseInt(step_number)) !== 'number' || step_number < 1) {
      res.status(400).json({
        message: 'invalid step'
      });
    }else {
      next();
    }
  }catch(error) {
    next(error)
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
