import React, {Component} from 'react';
import {compose, lifecycle, withProps} from "recompose";
import {Input} from 'antd';
import ObjectPath from 'object-path';
// import {
//     // withScriptjs,
//     withGoogleMap,
//     GoogleMap,
//     Marker,
//     InfoWindow,
// } from "react-google-maps";
import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";

const {TextArea} = Input;

const PlacesWithStandaloneSearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    // loadingElement: <div style={{ height: `100%` }} />,
    // containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.address !== this.props.address) {
        this.setState({
          value: nextProps.address
        })
      }
    },
    componentWillMount() {
      const refs = {};
      this.setState({
        places: [],
        value: null,
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          // console.log("%cplaces", 'color: #00b33c', places[0].geometry.location.lat(), places[0].geometry.location.lng())
          this.setState({
            places,
            value: places[0].formatted_address
          }, () => {
            let key = {};
            key[this.props.field] = this.state.value;
            this.props.form.setFieldsValue(key);
            if (this.props.setLocation) {
              this.props.setLocation(
                this.state.places[0].geometry.location.lat(),
                this.state.places[0].geometry.location.lng()
              )
            }

          });
        },
        handleChange: (e) => {
          this.setState({
            value: e.target.value
          }, () => {
            let key = {};
            key[this.props.field] = this.state.value;
            this.props.form.setFieldsValue(key);
          })
        }
      })
    },

  }),
)(props =>
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <TextArea
        className="ant-input "
        placeholder={props.placeholder || 'Địa chỉ'}
        onChange={props.handleChange}
        value={props.value}
        style={ObjectPath.get(props, 'customStyle')}
      />
    </StandaloneSearchBox>
  </div>
);

class AutoCompleteAddress extends Component {

  render() {
    return (
      <div>
        <PlacesWithStandaloneSearchBox
          address={this.props.value}
          form={this.props.form}
          field={this.props.field}
          setLocation={this.props.setLocation}
          customStyle={this.props.customStyle}
          placeholder={this.props.placeholder}
        />
        {/*<ol>*/}
        {/*{this.state.places.map(({ place_id, formatted_address, geometry: { location } }) =>*/}
        {/*<li key={place_id}>*/}
        {/*{formatted_address}*/}
        {/*{" at "}*/}
        {/*({location.lat()}, {location.lng()})*/}
        {/*</li>*/}
        {/*)}*/}
        {/*</ol>*/}
      </div>
    );
  }
}

export default AutoCompleteAddress;