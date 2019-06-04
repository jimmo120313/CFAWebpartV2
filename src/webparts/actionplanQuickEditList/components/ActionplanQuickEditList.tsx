import * as React from 'react';
import styles from './ActionplanQuickEditList.module.scss';
import { IActionplanQuickEditListProps } from './IActionplanQuickEditListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MaterialTable from 'material-table';
import { AddBox, ArrowUpward } from "@material-ui/icons";



export default class ActionplanQuickEditList extends React.Component<IActionplanQuickEditListProps, {}> {
  public render(): React.ReactElement<IActionplanQuickEditListProps> {
    return (
      <MaterialTable
        columns={[
          { title: 'Adı', field: 'name' },
          { title: 'Soyadı', field: 'surname' },
          { title: 'Doğum Yılı', field: 'birthYear', type: 'numeric' },
          { title: 'Doğum Yeri', field: 'birthCity', lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' } }
        ]}
        data={[{ name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 }, { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 }]}
        title="Demo Title"
      />
    );
  }
}
