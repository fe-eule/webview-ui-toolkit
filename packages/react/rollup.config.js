const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup');

module.exports = defaultConfig => {
  const nxConfig = nrwlConfig(defaultConfig);

  const isEsm = defaultConfig.output.format === 'esm';
  const commonOutputConfig = {
    exports: 'named',
    sourcemap: true,
  };
  const esmOutputConfig = {
    preserveModules: true,
  };
  const formatOutputConfig = isEsm ? esmOutputConfig : {};

  return {
    ...nxConfig,
    output: [
      {
        ...nxConfig.output,
        ...commonOutputConfig,
        ...formatOutputConfig,
      },
    ],
  };
};
