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
      prevLoaderPlacement: 0,
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
          return <Image key={'image-' + dto.id} dto={dto} removePhoto={this.removePhoto} />;
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
