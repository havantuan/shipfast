const rowStyle = {
  width: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
};
const colStyle = {
  marginBottom: '16px',
};

const blueButton = {
  width: '100%', backgroundColor: '#23b7e5', color: 'white'
};
const greenButton = {
  width: '100%', backgroundColor: '#5cb85c', color: 'white'
};
const orangeButton = {
  backgroundColor: '#FFA931', color: '#fff'
};
const redBg = {
  backgroundColor: '#EE3939', color: '#fff'
};
const greenBg = {
  backgroundColor: '#23AD44', color: '#fff'
};
const margin = {margin: '10px 8px 8px 0'};

const labelStatus = {
  textAlign: 'left',
  padding: '15px 20px',
  fontWeight: 'bold',
};

const textEdit = {
  textDecoration: 'underline',
  textDecorationStyle: 'dashed',
  color: '#3993cf',
  cursor: 'pointer',
};

const gutter = 16;
const colors = {
  100: "#7D4AC5",
  200: "#3399FF",
  300: "#cb7f8b",
  310: "#756b1a",
  320: "#FFFF99",
  390: "#FFCC66",
  395: "#FF9966",
  400: "#FFCC00",
  490: "#FF6699",
  500: "#FF6600",
  590: "#00FF00",
  600: "#000099",
  900: "#660066",
};

const types = {
  "ShippingCost": "up-circle",
  "COD": "forward",
  "TotalVasCost": "swap-right",
  "VATCost": "up-square",
  "Cumbersome": "share-alt",
  "GBH": "lock",
  "OilFee": "filter",
  "PickupInHub": "shop",
  "Surcharge": "plus-circle-o"
};

const basicStyle = {
  rowStyle,
  colStyle,
  gutter,
  margin,
  blueButton,
  greenButton,
  orangeButton,
  labelStatus,
  colors,
  types,
  textEdit,
  redBg,
  greenBg,
};

export default basicStyle;
