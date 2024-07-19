#[macro_export]
macro_rules! create_selector {
    ($name:ident, $return_state_prop:ident, $return_type:ty, $clone:expr) => {
        pub struct $name;
        impl redux_rs::Selector<State> for $name {
            type Result = $return_type;
            fn select(&self, state: &State) -> Self::Result {
                state.$return_state_prop.clone()
            }
        }
    };
    ($name:ident, $return_state_prop:ident, $return_type:ty) => {
        pub struct $name;
        impl redux_rs::Selector<State> for $name {
            type Result = $return_type;
            fn select(&self, state: &State) -> Self::Result {
                state.$return_state_prop
            }
        }
    };
}

#[macro_export]
macro_rules! create_selector_custom_fn {
    ($name:ident, $select_fn:expr, $return_type:ty) => {
        pub struct $name;
        impl redux_rs::Selector<State> for $name {
            type Result = $return_type;
            fn select(&self, state: &State) -> Self::Result {
                $select_fn(state)
            }
        }
    };
}