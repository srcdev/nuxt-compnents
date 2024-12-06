import { useResizeObserver } from '@vueuse/core';

const useNavDecoration = (navContainerRef: Ref<HTMLElement | null>, duration: number = 200) => {
  const navItems = ref<HTMLElement[] | null>(null);
  const previousActiveTab = ref<HTMLElement>();
  const currentActiveTab = ref<HTMLElement>();

  const previousHoveredTab = ref<HTMLElement>();
  const currentHoveredTab = ref<HTMLElement>();

  const initNavDecorators = () => {
    navItems.value = navContainerRef.value ? (Array.from(navContainerRef.value.querySelectorAll('[data-nav-item')) as HTMLElement[]) : [];
    previousActiveTab.value = navItems.value[0];
    currentActiveTab.value = navItems.value[0];
    previousHoveredTab.value = navItems.value[0];
    currentHoveredTab.value = navItems.value[0];
  };

  const navItemHovered = (event: Event) => {
    const target = event.target as HTMLElement;
    const newTabPosition = currentHoveredTab.value ? currentHoveredTab.value.compareDocumentPosition(target) : 0;

    if (newTabPosition !== 0) {
      previousHoveredTab.value = currentHoveredTab.value;
      currentHoveredTab.value = target;
      moveHoveredIndicator();
    }
  };

  const navItemClicked = (event: Event) => {
    const target = event.target as HTMLElement;

    previousActiveTab.value = currentActiveTab.value;
    currentActiveTab.value = target;

    navItems.value?.forEach((tab) => {
      tab.setAttribute('aria-selected', currentActiveTab.value === tab ? 'true' : 'false');
    });

    moveActiveIndicator();
  };

  const setFinalHoveredPositions = (resized: boolean = false) => {
    const setDuration = resized ? 0 : duration;
    const newTabWidth = currentHoveredTab.value && navContainerRef.value ? currentHoveredTab.value.offsetWidth / navContainerRef.value.offsetWidth : 0;
    navContainerRef.value?.style.setProperty('--_transition-duration', setDuration + 'ms');
    navContainerRef.value?.style.setProperty('--_left-hovered', currentHoveredTab.value?.offsetLeft + 'px');
    navContainerRef.value?.style.setProperty('--_width-hovered', newTabWidth?.toString());
  };

  const setFinalActivePositions = (resized: boolean = false) => {
    const setDuration = resized ? 0 : duration;
    const newTabWidth = currentActiveTab.value && navContainerRef.value ? currentActiveTab.value.offsetWidth / navContainerRef.value.offsetWidth : 0;
    navContainerRef.value?.style.setProperty('--_transition-duration', setDuration + 'ms');
    navContainerRef.value?.style.setProperty('--_left-active', currentActiveTab.value?.offsetLeft + 'px');
    navContainerRef.value?.style.setProperty('--_width-active', newTabWidth?.toString());
  };

  const moveActiveIndicator = () => {
    navContainerRef.value?.style.setProperty('--_transition-duration', duration + 'ms');

    const newTabPosition = previousActiveTab.value && currentActiveTab.value ? previousActiveTab.value.compareDocumentPosition(currentActiveTab.value) : 0;
    let transitionWidth;

    if (newTabPosition === 4) {
      transitionWidth = currentActiveTab.value && previousActiveTab.value ? currentActiveTab.value.offsetLeft + currentActiveTab.value.offsetWidth - previousActiveTab.value.offsetLeft : 0;
    } else {
      transitionWidth = previousActiveTab.value && currentActiveTab.value ? previousActiveTab.value.offsetLeft + previousActiveTab.value.offsetWidth - currentActiveTab.value.offsetLeft : 0;
      navContainerRef.value?.style.setProperty('--_left-active', currentActiveTab.value ? currentActiveTab.value.offsetLeft + 'px' : '0');
    }

    navContainerRef.value?.style.setProperty('--_width-active', String(transitionWidth / navContainerRef.value.offsetWidth));

    setTimeout(() => {
      setFinalActivePositions();
    }, Math.floor(duration + 20));
  };

  const moveHoveredIndicator = () => {
    navContainerRef.value?.style.setProperty('--_transition-duration', duration + 'ms');

    const newTabPosition = previousHoveredTab.value && currentHoveredTab.value ? previousHoveredTab.value.compareDocumentPosition(currentHoveredTab.value) : 0;
    let transitionWidth;

    if (newTabPosition === 4) {
      transitionWidth = currentHoveredTab.value && previousHoveredTab.value ? currentHoveredTab.value.offsetLeft + currentHoveredTab.value.offsetWidth - previousHoveredTab.value.offsetLeft : 0;
    } else {
      transitionWidth = previousHoveredTab.value && currentHoveredTab.value ? previousHoveredTab.value.offsetLeft + previousHoveredTab.value.offsetWidth - currentHoveredTab.value.offsetLeft : 0;
      navContainerRef.value?.style.setProperty('--_left-hovered', currentHoveredTab.value ? currentHoveredTab.value.offsetLeft + 'px' : '0');
    }

    navContainerRef.value?.style.setProperty('--_width-hovered', String(transitionWidth / navContainerRef.value.offsetWidth));

    setTimeout(() => {
      setFinalHoveredPositions();
    }, Math.floor(duration + 20));
  };

  useResizeObserver(navContainerRef, () => {
    setFinalActivePositions(true);
    setFinalHoveredPositions(true);
  });

  return {
    initNavDecorators,
    navContainerRef,
    navItemClicked,
    navItemHovered,
  };
};

export default useNavDecoration;
