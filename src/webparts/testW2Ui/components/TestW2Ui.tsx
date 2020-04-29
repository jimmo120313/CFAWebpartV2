import * as React from 'react';
import styles from './TestW2Ui.module.scss';
import { ITestW2UiProps } from './ITestW2UiProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class TestW2Ui extends React.Component<ITestW2UiProps, {}> {
  public render(): React.ReactElement<ITestW2UiProps> {
    return (
      <div className={ styles.testW2Ui }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
