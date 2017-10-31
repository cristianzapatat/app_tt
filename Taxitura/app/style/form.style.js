'use strict'
/* See style native node_modules\tcomb-form-native\lib\stylesheets\bootstrap.js */
import load from 'lodash'
import t from 'tcomb-form-native'

let stylesheet = load.cloneDeep(t.form.Form.stylesheet)

stylesheet.textbox.normal.fontSize = 20
stylesheet.textbox.normal.borderRadius = 10
stylesheet.controlLabel.normal.fontSize = 20

module.exports = stylesheet
