import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'ActionplanQuickEditListWebPartStrings';
import ActionplanQuickEditList from './components/ActionplanQuickEditList';
import { IActionplanQuickEditListProps } from './components/IActionplanQuickEditListProps';

export interface IActionplanQuickEditListWebPartProps {
  description: string;
}

export default class ActionplanQuickEditListWebPart extends BaseClientSideWebPart<IActionplanQuickEditListWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IActionplanQuickEditListProps > = React.createElement(
      ActionplanQuickEditList,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
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
