'use client'

import { useMountEffect } from 'common/hooks/useMountEffect'

import { attachImageZoom } from './attachImageZoom'

// mount once per app, a second mount would zoom every image twice
export const ImageZoom = () => {
  useMountEffect(attachImageZoom)
  return null
}
