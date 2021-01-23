import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import Modal from "react-modal";
Modal.setAppElement("#app");

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      deg: 0,
      modalIsOpen: false
    };
  }

  calcImageSize() {
    const galleryWidth = document.body.clientWidth;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = galleryWidth / imagesPerRow;
    this.setState({
      size,
    });
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  componentDidMount() {
    this.calcImageSize();
    window.addEventListener("resize", this.calcImageSize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.calcImageSize);
  }
  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${this.state.deg}deg)`
        }}
        draggable
        onDragStart={this.props.onDragStart}
        onDragOver={this.props.onDragOver}
        onDrop={(event) => this.props.onDrop(event, this.props.dto)}
        >
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.closeModal()}
          shouldCloseOnOverlayClick={true}
          className="modal"
          overlayClassName="overlay"
          contentLabel="Image Modal"
        >
          <img
            src={this.urlFromDto(this.props.dto)}
            className="modal-content"
          ></img>
        </Modal>
        <div style={{ position: "absolute", display: "flex", height: "100%", width: "100%", padding: "0" }}>
          <div style={{ flexGrow: 1, height: "100%" }}
            onDragEnter={this.props.onDragEnter}
            onDragLeave={this.props.onDragLeave}></div>
          <div style={{ flexGrow: 1, height: "100%" }}
            onDragEnter={this.props.onDragEnter}
            onDragLeave={this.props.onDragLeave}></div>
        </div>
        <div id="buttons" style={{ transform: `rotate(-${this.state.deg}deg)` }}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={() => this.setState((prevState) => ({ deg: prevState.deg + 90, }))} />
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => this.props.removePhoto(this.props.dto.id)} />
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={() => this.setState({ modalIsOpen: true })} />
        </div>
      </div>
    );
  }
}

export default Image;
