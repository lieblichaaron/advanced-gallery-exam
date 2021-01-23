import axios from "axios";
let initilized = false;

/*function will return state to set*/
export function getImages(tag, stateImages, serverPage, newTag) {
    return new Promise((resolve) => {
        const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1&page=${serverPage}&sort=interestingness-desc`;
        const baseUrl = "https://api.flickr.com/";
        axios({
            url: getImagesUrl,
            baseURL: baseUrl,
            method: "GET",
        })
            .then((res) => res.data)
            .then((res) => {
                if (
                    res &&
                    res.photos &&
                    res.photos.photo &&
                    res.photos.photo.length > 0
                ) {
                    if (newTag) {
                        resolve(filterImagesFromNewTag(res.photos.photo));
                    } else {
                        resolve(filterImagesFromScroll(stateImages, res.photos.photo));
                    }
                }
            });
    });
}

function filterImagesFromNewTag(imagesFromServer) {
    const tempImages = imagesFromServer.filter((img) => {
        return img.server !== 0;
    });
    const newState = {
        images: tempImages,
        serverPage: 0,
        loading: false,
    };
    return newState;
}

function filterImagesFromScroll(stateImages, imagesFromServer) {
    if (!initilized) {
        initilized = true
        return false
    }
    const tempImages = stateImages
    const newImages = imagesFromServer.filter((imgFromServer) => {
        let duplicate = false;
        tempImages.forEach((imgFromState) => {
            if (imgFromState.id === imgFromServer.id) duplicate = true
        })
        if (duplicate || imgFromServer.server == 0) {
            return false;
        }
        else { return true; }
    });
    const newState = (prevState) => ({
        images: [...tempImages, ...newImages],
        serverPage: prevState.serverPage + 1,
        loading: false,
    });
    return newState;
}
