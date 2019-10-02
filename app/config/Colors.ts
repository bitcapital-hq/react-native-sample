/* Base colors */
const base = {
  white: '#FAFAFA',
  black: '#17191A',
  transparent: 'transparent'
};

/* Utility colors */
const utility = {
  success: '#8BC34A',
  warn: '#FFC107',
  info: '#2196F3',
  error: '#F44336'
}

/* Theme colors */
const theme = {
  primaryDark: '#e2601d',
  primary: '#FE823C',
  primaryLight: '#FFE0B2',
  textPrimary: '#212121',
  textSecondary: '#757575',
  accent: '#607D8B',
  divider: '#BDBDBD',
  shadow: 'rgba(0,0,0,0.25)',
  placeholderWhite: '#ECECEC',
  gray: '#535353',
  grayDark: '#3a3a3a',
  grayLight: '#d8d8d8',
  grayDarker: '#222222', 
}

export default {
  ...base,
  ...utility,
  ...theme,
}