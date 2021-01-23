import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import './Gallery.scss';
import { getImages } from "../../serverFuncs";

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.removePhoto = this.removePhoto.bind(this);
    this.state = {
      images: [],
      loading: false,
      serverPage: 0,
      prevLoaderPlacement: 0
    };
  }

  /*newTag parameter will distinguish between call from tag or scroll*/
  getImagesFromServer = (newTag) => {
    this.setState({ loading: true });
    getImages(
      newTag ? newTag : this.props.tag,
      this.state.images,
      this.state.serverPage,
      newTag
      ).then((newState) => {
        if (newState) this.setState(newState);
    });
  };
  removePhoto(photoId) {
    const tempImages = this.state.images;
    const newImages = tempImages.filter((img) => {
      return img.id !== photoId;
    });
    this.setState({ images: newImages });
  }
/*functions for infinite scroll*/
  setIntersectionObserver = () => {
    this.observer = new IntersectionObserver(this.handleObserver.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: .1,
    });
    this.observer.observe(document.getElementById("loadMore"));
  };
  handleObserver(entries) {
    const loaderPlacement = entries[0].boundingClientRect.y;
    if (this.state.prevLoaderPlacement > loaderPlacement) {
      this.setState({ loading: true });
      this.getImagesFromServer();
    }
    this.setState({ prevLoaderPlacement: loaderPlacement });
  }
  /*functions for drag and drop*/
  onDragStart = (event, img) => {
    event.dataTransfer.setData("draggedImg", JSON.stringify(img));
  };
  onDragEnter = (event) => {
    const before = this.calcDropPlace(event, event.target.parentNode)
    event.currentTarget.classList.add(before ? "over-left" : "over-right")
  }
  onDragLeave = (event) => {
    event.currentTarget.classList.remove("over-right")
    event.currentTarget.classList.remove("over-left")
  }
  onDragOver = (event) => {
    event.preventDefault();
  };
  calcDropPlace = (event, target) => {
    const distanceIntoPhoto =
      event.screenX % target.offsetWidth;
    const halfWayIntoPhoto = target.offsetWidth / 2;
    return distanceIntoPhoto <= halfWayIntoPhoto;
  };
  reOrderList = (draggedImg, imgDroppedOver, before) => {
    const tempImages = this.state.images;
    tempImages.splice(
      tempImages.findIndex((img) => img.id === draggedImg.id),
      1
    );
    if (before) {
      tempImages.splice(
        tempImages.findIndex((img) => img === imgDroppedOver),
        0,
        draggedImg
      );
    } else {
      tempImages.splice(
        tempImages.findIndex((img) => img === imgDroppedOver) + 1,
        0,
        draggedImg
      );
    }
    return tempImages;
  };
  onDrop = (event, imgDroppedOver) => {
    const draggedImg = JSON.parse(event.dataTransfer.getData("draggedImg"));
    event.currentTarget.classList.remove("over-right")
    event.currentTarget.classList.remove("over-left")
    if (draggedImg.id === imgDroppedOver.id) return;
    const before = this.calcDropPlace(event, event.currentTarget);
    const tempImages = this.reOrderList(draggedImg, imgDroppedOver, before);
    this.setState({
      images: tempImages,
    });
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.getImagesFromServer(this.props.tag)
    this.setIntersectionObserver();
  }

  componentWillReceiveProps(props) {
    this.setState({ serverPage: 0, loading: true });
    this.getImagesFromServer(props.tag);
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return (
            <Image
              key={'image-' + dto.id}
              dto={dto}
              removePhoto={this.removePhoto}
              onDragStart={(event) => this.onDragStart(event, dto)}
              onDragEnter={(event) => this.onDragEnter(event)}
              onDragLeave={(event) => this.onDragLeave(event)}
              onDragOver={(event) => this.onDragOver(event)}
              onDrop={(event, img) => {
                this.onDrop(event, img);
              }} />
          );
        })}
        <div id="loadMore" className="observed"></div>
        <span style={{ display: this.state.loading ? "block" : "none" }}>
          Loading...
        </span>
      </div>
    );
  }
}

export default Gallery;
