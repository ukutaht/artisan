import React from 'react'

class StoryModal extends React.Component {
  constructor(props) {
    super(props);
    this.story = props.story;
  }

  componentWillReceiveProps(props) {
    if (props.visible) {
      this.listenForEscape()
    } else {
      this.stopListeningForEscape()
    }
  }

  listenForEscape() {
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            this.props.onClose()
        }
    }.bind(this)
  }

  stopListeningForEscape() {
    document.onkeydown = null
  }

  render() {
    if (!this.props.visible) {
      return null
    }

    return (
        <div className="modal-container">
          <div className="modal">
            <header className="modal__header">
              <h4>#{this.story.number} {this.story.name}</h4>
              <i className="ion-android-close modal__close" onClick={this.props.onClose}></i>
            </header>
            <div className="modal__body row">
              <form>
                <div className="eight-columns">
                  <section className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" defaultValue={this.story.name}/>
                  </section>

                  <label>Acceptance criteria</label>
                  <textarea rows="15"></textarea>
                  <span>Created by Uku Taht on 2 Jan 2015</span>
                </div>
                <div className="four-columns story-right">
                  <div className="estimate-form">
                    <section className="estimate-form__group">
                      <label className="estimate-form__left">Optimistic:</label>
                      <input type="text" className="estimate-form__right" />
                    </section>
                    <section className="estimate-form__group">
                      <label className="estimate-form__left">Realistic:</label>
                      <input type="text" className="estimate-form__right" />
                    </section>
                    <section className="estimate-form__group">
                      <label className="estimate-form__left">Pessimistic:</label>
                      <input type="text" className="estimate-form__right" />
                    </section>
                    <section className="estimate-form__total">
                      <label className="estimate-form__left">Estimate:</label>
                      <span className="estimate-form__right">4.5</span>
                    </section>
                  </div>

                  <section className="form-group">
                    <label>Assigned user</label>
                    <select className="assigned-user__select">
                      <option>Uku Taht</option>
                      <option>Felipe Sere</option>
                      <option>Makis Otman</option>
                      <option>Iris Varsi</option>
                    </select>
                  </section>

                  <section className="form-group">
                    <label>Tags</label>
                    <input type="text" name="name" placeholder="Comma-separated"/>
                  </section>

                  <button className="button primary save-story-button">Update Story</button>
                </div>
              </form>
            </div>
          </div>
        </div>

    )
  }
}

export default StoryModal
