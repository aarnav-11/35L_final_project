// Artillery processor functions (CommonJS)

const randomText = () => `load-test-${Math.random().toString(36).substring(2, 10)}`;

module.exports = {
  setNoteBody: function(context, events, done) {
    context.vars.noteTitle = `Artillery Test ${randomText()}`;
    context.vars.noteBody = `Load test content at ${new Date().toISOString()} - ${randomText()}`;
    return done();
  }
};