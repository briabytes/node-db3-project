const db = require('../../data/db-config');

function find() { 
  return db('schemes as sc')
    .leftJoin(
      'steps as st', 
      'sc.scheme_id', 
      'st.scheme_id')
    .column('sc.scheme_id', 'sc.scheme_name')
    .count({
      number_of_steps: 'st.step_id'
    })
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id', 'asc')
}

async function findById(scheme_id) { 
  const steps = await db('schemes as sc')
      .leftJoin(
        'steps as st', 
        'sc.scheme_id', 
        'st.scheme_id')
      .column(
        'st.scheme_id', 
        'sc.scheme_name', 
        'st.step_id', 
        'st.step_number', 
        'st.instructions')
      .where('st.scheme_id', '=', scheme_id)
      .orderBy('st.step_number', 'asc')

      if(steps.length !== 0) {
        const StepsObject = {
          scheme_id: steps[0]['scheme_id'],
          scheme_name: steps[0]['scheme_name'],
          steps: steps.reduce((acc, val) => {
            return acc.concat(
              (({step_id, step_number, instructions}) => ({step_id, step_number, instructions}))(val)
            )
          }, [])
        }
        return Promise.resolve(StepsObject);
      }else {
        const noSteps = await db('schemes').where('scheme_id', scheme_id)
        noSteps[0].steps = steps
        return noSteps[0]
      }
}

function findSteps(scheme_id) { 
  return db('schemes as sc')
      .join(
        'steps as st', 
        'sc.scheme_id', 
        'st.scheme_id')
      .where('sc.scheme_id', scheme_id)
      .column(
        'step_id', 
        'step_number', 
        'instructions',
        'scheme_name')
      .orderBy('step_number', 'asc')
}

async function add(scheme) { 
  const id = await db('schemes')
    .insert(scheme)

  return findById(id)
}

async function addStep(scheme_id, step) { 
  const addStep = {
    scheme_id: scheme_id,
    step_number: parseInt(step.step_number),
    instructions: step.instructions
  }

  await db('steps')
    .insert(addStep)

  return findSteps(scheme_id)
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
