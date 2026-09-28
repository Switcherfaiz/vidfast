export async function checkIntro() {
  try {
    const introDone = localStorage.getItem('intro') === 'true';
    return {
      introDone,
      shouldShowIntro: !introDone
    };
  } catch (_) {
    return {
      introDone: false,
      shouldShowIntro: false
    };
  }
}
