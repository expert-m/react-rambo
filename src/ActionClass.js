import { DecoratorHelper, replaceActionType } from './utils'


export default function ActionClass(target) {
  if (DecoratorHelper.isDecorated(target)) {
    return target
  }

  const methodNames = DecoratorHelper.getStaticMethodNames(target)

  methodNames.forEach(methodName => {
    const method = DecoratorHelper.getStaticMethod(target, methodName)

    const newMethod = function () {
      const action = method(...arguments)

      if (action instanceof Function) {
        return async (dispatch, getState, ...args) => {
          const decoratedDispatch = (action) => {
            replaceActionType(action)
            return dispatch(action)
          }

          return await action(decoratedDispatch, getState, ...args)
        }
      } else {
        replaceActionType(action)
        return action
      }
    }

    DecoratorHelper.setStaticMethod(target, methodName, newMethod)
  })

  DecoratorHelper.markAsDecorated(target)
  return target
}
