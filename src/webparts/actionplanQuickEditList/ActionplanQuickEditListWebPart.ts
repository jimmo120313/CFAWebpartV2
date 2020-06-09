import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'ActionplanQuickEditListWebPartStrings';
import { AppContainer, IAppContainerProps } from './components/AppContainer';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IActionplanQuickEditListWebPartProps {
  description: string;
}

export default class ActionplanQuickEditListWebPart extends BaseClientSideWebPart<IActionplanQuickEditListWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAppContainerProps> = React.createElement(
      AppContainer,
      {
        siteURL:this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);

  }

  protected onInit(): Promise<void> {
    // TODO: move into package for offline support
    SPComponentLoader.loadCss('https://fonts.googleapis.com/icon?family=Material+Icons');
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/antd/3.19.0/antd.css');
    return super.onInit();
  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
