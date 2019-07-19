/**
 * A newly added, blank sound
 */
export default function defaultSound() {
  return {
    id: '<uninitialized ID>',
    name: 'New Sound',
    description: '',
    volume: 0.9,
    backoff: 0.2,
    loop: false,
    // file: data:audio/wav;base64,ABC
    speech: ''
  }
}
