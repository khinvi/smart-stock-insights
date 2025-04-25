global.chrome = {
    runtime: {
      sendMessage: jest.fn(),
      onMessage: {
        addListener: jest.fn()
      }
    },
    storage: {
      local: {
        get: jest.fn(),
        set: jest.fn()
      }
    },
    tabs: {
      query: jest.fn()
    },
    contextMenus: {
      create: jest.fn(),
      onClicked: {
        addListener: jest.fn()
      }
    }
  };