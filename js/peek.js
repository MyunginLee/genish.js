'use strict'

let gen  = require('./gen.js')

let proto = {
  basename:'peek',

  gen() {
    let genName = 'gen.' + this.name,
        inputs = gen.getInputs( this ),
        out, functionBody

functionBody = `  let ${this.name}_data  = gen.data.${this.dataName},
      ${this.name}_phase = ${this.mode === 'samples' ? inputs[0] : inputs[0] + ' * gen.data.' + this.dataName + '.length'}, 
      ${this.name}_index = ${this.name}_phase | 0,\n`
      
if( this.interp === 'linear' ) {      
  functionBody += `      ${this.name}_frac  = ${this.name}_phase - ${this.name}_index,
      ${this.name}_base  = ${this.name}_data[ ${this.name}_index ],
      ${this.name}_out   = ${this.name}_base + ${this.name}_frac * ( ${this.name}_data[ (${this.name}_index+1) & (${this.name}_data.length - 1) ] - ${this.name}_base ) 

`
}else{
  functionBody += `      ${this.name}_out = ${this.name}_data[ ${this.name}_index ]\n\n`
}
    gen.memo[ this.name ] = this.name + '_out'

    return [ this.name+'_out', functionBody ]
  },
}

module.exports = ( data, index, properties ) => {
  let ugen = Object.create( proto ),
      defaults = { channels:1, mode:'phase', interp:'linear' } 

  if( properties !== undefined ) Object.assign( defaults, properties )

  Object.assign( ugen, { 
    data,
    dataName:   data.name,
    uid:        gen.getUID(),
    inputs:     [ index ],
  },
  defaults )
  
  ugen.name = ugen.basename + ugen.uid

  return ugen
}
