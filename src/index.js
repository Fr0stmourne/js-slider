/* eslint-disable @typescript-eslint/explicit-function-return-type */
import './components/plugin/index.ts';
import 'normalize.css';
import 'webpack-jquery-ui';

function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('./pages/', true, /\.(j|t)s$/));
importAll(require.context('./', true, /\.scss$/));
importAll(require.context('./', true, /\.(jpeg|jpg|png|gif|svg)$/));
