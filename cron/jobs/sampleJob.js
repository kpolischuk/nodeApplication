module.exports = (params) => {
  // Input data located here :
  const { data } = params.attrs;
  // eslint-disable-next-line no-console
  console.table(Object.assign(data, { internalValue: new Date().toLocaleString() }));
  throw new Error('test error');
};
