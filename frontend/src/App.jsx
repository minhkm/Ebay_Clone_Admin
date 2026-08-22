import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppRoutes from './routes/AppRoutes';

const ebayTheme = {
  token: {
    colorPrimary: '#3665f3',
    colorLink: '#0064d2',
    colorLinkHover: '#0053a0',
    colorSuccess: '#52c41a',
    colorWarning: '#fa8c16',
    colorError: '#e53238',
    colorInfo: '#0064d2',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    borderRadius: 6,
    colorBgBase: '#ffffff',
    colorTextBase: '#191919',
    colorBorder: '#e5e7eb',
    colorBorderSecondary: '#f0f0f0',
  },
  components: {
    Button: {
      colorPrimary: '#3665f3',
      colorPrimaryHover: '#2752db',
      borderRadius: 6,
      controlHeight: 36,
    },
    Table: {
      headerBg: '#fafbfc',
      headerColor: '#595959',
      rowHoverBg: '#f8fafc',
    },
    Card: {
      headerFontSize: 15,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={ebayTheme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
