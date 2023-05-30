import { createContext } from 'react'

// createContext 只需_默认值_这么一个参数。在这里, 1 表示最大的标题级别，但是你可以传递任何类型的值（甚至可以传入一个对象）。你将在下一个步骤中见识到默认值的意义。
export const LevelContext = createContext(1)
