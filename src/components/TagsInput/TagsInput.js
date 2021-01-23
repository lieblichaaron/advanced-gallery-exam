import React from 'react';
import './TagsInput.scss'

class TagsInput extends React.Component {
    constructor(props) {
        super(props);

    };

    removeTag = (i) => {
        const newTags = [...this.props.tags];
        newTags.splice(i, 1);
        this.props.setTags({ tags: newTags });
    }

    inputKeyDown = (e) => {
        const val = e.target.value;
        if (e.key === 'Enter' && val) {
            if (this.props.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
                return;
            }
            this.props.setTags({ tags: [...this.props.tags, val] });
            this.tagInput.value = null;
        } else if (e.key === 'Backspace' && !val) {
            this.removeTag(this.props.tags.length - 1);
        }
    }

    render() {
        return (
            <div className="outer-input">
                <div className="input-container">
                    <ul className="tags">
                        {this.props.tags.map((tag, i) => (
                            <li key={tag}>
                                {tag}
                                <button type="button" onClick={() => { this.removeTag(i); }}>x</button>
                            </li>
                        ))}
                        <li className="input"><input type="text" onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} /></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default TagsInput