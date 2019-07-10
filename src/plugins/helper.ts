import { Component, Vue } from 'vue-property-decorator';
const localVue = new Vue();

@Component
export default class Api extends Vue {
  public install() {
    const COLORS: any = [
      'blue',
      'red',
      'teal',
      'purple',
      'indigo',
      'light-blue',
      'green',
      'deep-purple',
      'deep-orange',
      'brown',
      'blue-grey',
      'cyan',
    ];

    const Helper = {
      getDownloadLink: (url: string) => {
        return `${url}?token=${localStorage.getItem('user-token')}`;
      },

      getLightenDarkenColor(col: string, amt: number) {
        try {
          let usePound: any = false;

          if (col[0] === '#') {
            col = col.slice(1);
            usePound = true;
          }

          const num: any = parseInt(col, 16);
          let r: any = (num >> 16) + amt;

          if (r > 255) {
            r = 255;
          } else if (r < 0) {
            r = 0;
          }

          let b: any = ((num >> 8) & 0x00ff) + amt;

          if (b > 255) {
            b = 255;
          } else if (b < 0) {
            b = 0;
          }

          let g: any = (num & 0x0000ff) + amt;

          if (g > 255) {
            g = 255;
          } else if (g < 0) {
            g = 0;
          }

          return (
            (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
          );
        } catch (e) {
          return '';
        }
      },

      getRandomColorClassArray(index: number) {
        try {
          const itemIndex = index % COLORS.length;

          const classes: any = {};
          classes[COLORS[itemIndex]] = true;
          classes['lighten-2'] = true;

          return classes;
        } catch (e) {
          return [];
        }
      },

      formatDate(date: string, format = 'DD.MM.YYYY') {
        try {
          return date ? localVue.$Moment.unix(date).format(format) : '';
        } catch (e) {
          return '';
        }
      },

      htmlToString(html: string) {
        try {
          return html.replace(/<[^>]*>?/gm, '');
        } catch (e) {
          return '';
        }
      },

      transformToVuetifyGrid(grid: any) {
        try {
          const result: any = {};

          // Выстраиваем порядок строк
          for (const item of grid) {
            if (!result[item.y]) {
              result[item.y] = [];
            }
            result[item.y].push({
              width: item.w,
              offsetX: 0,
              x: item.x,
              i: item.i,
            });
          }

          // Выстраиваем порядок столбцов
          localVue.$_.each(result, (row: any, key: any) => {
            result[key] = localVue.$_.sortBy(row, (item: any) =>
              localVue.$_.toNumber(item.x),
            );
          });

          // Определяем смещение
          localVue.$_.each(result, (row: any, keyRow: any) => {
            localVue.$_.each(row, (col: any, keyCol: any) => {
              if (keyCol === 0) {
                result[keyRow][keyCol].offsetX = col.x;
              } else {
                result[keyRow][keyCol].offsetX =
                  result[keyRow][keyCol].x -
                  (result[keyRow][keyCol - 1].x +
                    result[keyRow][keyCol - 1].width);
              }
            });
          });

          return result;
        } catch (e) {
          return grid;
        }
      },

      async checkObjectsAccess(
        objectClass: any,
        objectCards: any,
        actions: any = ['VIEW', 'EDIT', 'DELETE'],
      ) {
        try {
          const rulesQueries: any = [];

          localVue.$_.forEach(objectCards, (objectCard: any) => {
            localVue.$_.forEach(actions, (action: string) => {
              rulesQueries.push(
                new Promise((resolve: any) => {
                  localVue.$API.object.rules
                    .execute({
                      action,
                      objectClass,
                      objectCard,
                    })
                    .then((r: any) => {
                      resolve({
                        action,
                        objectCard,
                        data: r.data,
                      });
                    });
                }),
              );
            });
          });
          return await Promise.all(rulesQueries);
        } catch (e) {
          return null;
        }
      },
    };

    Object.defineProperty(Vue.prototype, '$Helper', { value: Helper });
  }
}
