import F2 from '../component/f2-canvas/lib/f2';

let chart = null;

function columnChart(canvas, width, height) {
  const data = [{
      year: '1951 年',
      sales: 38
    },
    {
      year: '1952 年',
      sales: 52
    },
    {
      year: '1956 年',
      sales: 61
    },
    {
      year: '1957 年',
      sales: 145
    },
    {
      year: '1958 年',
      sales: 48
    },
    {
      year: '1959 年',
      sales: 38
    },
    {
      year: '1960 年',
      sales: 38
    },
    {
      year: '1962 年',
      sales: 38
    },
  ];
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    sales: {
      tickCount: 5
    }
  });
  chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
      const {
        items
      } = ev;
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = '¥ ' + items[0].value;
    }
  });
  chart.interval().position('year*sales');
  chart.render();
  return chart;
}

function pieChart(canvas, width, height) {
  const map = {
    '芳华': '40%',
    '妖猫传': '20%',
    '机器之血': '18%',
    '心理罪': '15%',
    '寻梦环游记': '5%',
    '其他': '2%',
  };
  const data = [{
      name: '芳华',
      percent: 0.4,
      a: '1'
    },
    {
      name: '妖猫传',
      percent: 0.2,
      a: '1'
    },
    {
      name: '机器之血',
      percent: 0.18,
      a: '1'
    },
    {
      name: '心理罪',
      percent: 0.15,
      a: '1'
    },
    {
      name: '寻梦环游记',
      percent: 0.05,
      a: '1'
    },
    {
      name: '其他',
      percent: 0.02,
      a: '1'
    }
  ];
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data, {
    percent: {
      formatter(val) {
        return val * 100 + '%';
      }
    }
  });
  chart.legend({
    position: 'left',
    itemFormatter(val) {
      return val + '  ' + map[val];
    }
  });
  chart.tooltip(false);
  chart.coord('polar', {
    transposed: true,
    radius: 0.85
  });
  chart.axis(false);
  chart.interval()
    .position('a*percent')
    .color('name', ['#858585', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
    .adjust('stack')
    .style({
      lineWidth: 0.5,
      stroke: '#fff',
      lineJoin: 'round',
      lineCap: 'round'
    })
    .animate({
      appear: {
        duration: 1000,
        easing: 'bounceOut'
      }
    });

  chart.render();
  return chart;
}

Page({
  onShareAppMessage: function(res) {
    return {
      title: 'F2 微信小程序图表组件，你值得拥有~',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },
  data: {
    columnChart: {
      onInit: columnChart
    },
    pieChart: {
      onInit: pieChart
    }
  },

  onReady() {}
});