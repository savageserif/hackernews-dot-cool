export function testObjectErrorEventsSupport() {
  const objectElement = document.createElement('object');

  objectElement.style.visibility = 'hidden';
  objectElement.style.width = '0';
  objectElement.style.height = '0';

  objectElement.data = '/object-error-test.html';

  objectElement.addEventListener('error', () => {
    // object tag error events are supported
    objectElement.remove();
  });

  objectElement.addEventListener('load', () => {
    // object tag error events are not supported
    window.dispatchEvent(new Event('object-error-events-unsupported'));
    objectElement.remove();
  });

  document.documentElement.append(objectElement);
}
