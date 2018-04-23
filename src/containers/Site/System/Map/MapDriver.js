import React, {Component} from 'react';
import ObjectPath from "object-path";
import {compose, withProps} from "recompose";
// import {lifecycle} from "recompose";
import {GoogleMap, InfoWindow, Marker, withGoogleMap,} from "react-google-maps";
// import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";
import {Col, Icon, Row, Spin} from 'antd';
import ContentHolder from '../../../../components/utility/ContentHolder';
import "./Style.css";
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import {inject, observer} from 'mobx-react';
import {Keys} from "../../../../stores/index";

const MapWithAMakredInfoWindow = compose(
  withProps({
    loadingElement: <div style={{height: `100%`}}/>,
    containerElement: <div style={{height: `650px`}}/>,
    mapElement: <div style={{height: `100%`}}/>,
  }),
  // withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={13}
    center={props.location}
  >
    {
      props.dataSource.map(val => (
        <Marker
          key={`${val.ID}`}
          position={{lat: val.Lat, lng: val.Lng}}
          onClick={() => props.onToggleOpen(val.ID)}
          defaultIcon={require('../../../../image/map32x51.png')}
        >
          {
            props.isOpen[val.ID] &&
            <InfoWindow
              onCloseClick={() => props.onToggleOpen(val.ID)}
            >
              <div>
                <p>{val.DisplayName}</p>
                <p><b>SĐT: </b>{val.Phone}</p>
                <p><b>Địa chỉ: </b>{val.Address}</p>
                <p><b>Trạng thái: </b>{ObjectPath.get(val, 'State.Name')}</p>
              </div>
            </InfoWindow>
          }
        </Marker>
      ))
    }
  </GoogleMap>
);

@inject(Keys.hubsForMap)
@observer
export default class MapDriver extends Component {

  constructor(props) {
    super(props);
    this.hubsForMap = props.hubsForMap;
  }

  componentDidMount() {
    this.hubsForMap.fetch();
  }

  render() {
    const {dataSource, fetching} = this.hubsForMap;

    return (
      <PageHeaderLayout title="Mạng lưới điểm gửi hàng">
        <ContentHolder>
          <Row justify="start">
            <Col md={8} sm={8} xs={24}>
              <Spin spinning={fetching}>
                <ul className="hubs-menu">
                  {dataSource.map(val =>
                    <li
                      key={`${val.ID}`}
                      onClick={() => this.hubsForMap.onChangeLocation(val)}
                      className={val.ID === this.hubsForMap.isActive ? 'active' : ''}
                    >
                      <h3><Icon type="home"/> {val.DisplayName}</h3>
                      <p>- SĐT: {val.Phone}</p>
                      <p>- Tỉnh thành: {ObjectPath.get(val, "City.Name")}</p>
                      <p>- Quận/ Huyện: {ObjectPath.get(val, "District.Name")}</p>
                      <p>- Địa chỉ: {val.Address}</p>
                    </li>
                  )}
                </ul>
              </Spin>
            </Col>

            <Col md={16} sm={16} xs={24}>
              <MapWithAMakredInfoWindow
                location={this.hubsForMap.location}
                dataSource={dataSource}
                isOpen={this.hubsForMap.isOpen}
                onToggleOpen={this.hubsForMap.onToggleOpen}
              />
            </Col>
          </Row>
        </ContentHolder>
      </PageHeaderLayout>
    )
  }
}