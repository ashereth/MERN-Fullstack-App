import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator'

import HttpError from "../models/http-error.js";
import User from '../models/user.js';


//get a list of all users
const getAllUsers = async (req, res, next) => {
    let allUsers;
    try {
        //get the email and name of all users
        allUsers = await User.find({}, 'email name -_id');
    } catch (error) {
        return next(HttpError('Something went wrong could not get users.', 500));
    }

    res.json({ users: allUsers.map((user) => user.toObject({ getters: false })) });
}

//create a new user and log them in
const createUser = async (req, res, next) => {
    //check all the validators for errors
    const errors = validationResult(req);
    //if errors occured throw an error
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input', 422));
    }

    const { name, email, password, places } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        return next(new HttpError('Something went wrong, signup failed', 500));
    }

    if (existingUser) {
        return next(new HttpError('User already exists, please login.', 422));
    }

    const newUser = new User({
        name,
        email,
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAnAMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAEBQMGAAECB//EADkQAAIBAwIEBAUCBAYCAwAAAAECAwAEERIhBTFBURMiYXEGFDKBkaHRFULB8CNSYrHh8SSSM0Oy/8QAGgEAAwEBAQEAAAAAAAAAAAAAAAECAwUEBv/EACQRAAICAQQCAgMBAAAAAAAAAAABAhEDEhMhMQRBBVEiMnEU/9oADAMBAAIRAxEAPwB38P8AC4vlhcXQHiMM7jlTuDwd0HL2pRHxu3lUx6CvQZom7v47a21x4JxXKxZcO2ZXySX1okT+Ihy2OWajhuVuT4ZbDr0zQVhxJJY3kuGy3vXFp4ZnNzESMHcHtWSy3NbfQxnxC8t7C0Z7yRUhAyWbv2Hc15vxf4/McxPD0Ea531HJPvSn4/8AieXit80ER028BKKAdiepqkuxwSxzXUjH7KSosl98a8Zu1MZunWNhggHmKSNeTvp1TOdPLJ5UKqO5wqk+wrZjkU4ZSPcVZQ0t+JXbnRNcyFOW51YHandnxW1txi5aZgy6PX0+1VFGKsNQBpnb2k0sTMsaYG/mFAB95evFEY7S8cx5/wDhcDA+/WkrMWbLvt27V3eMyeTCFvQVAltNIcBT60gD7bid7akSQ3T5/wAuqrBwv46v7dsSzO2T5tbZyPbtVV/hl5u0cZfGc6TmoG1htEqYYdCNxRQHu3w/xzh/H4joZUucZdCdmHdaNuLWHOlUBBHOvD+BcTm4bfRzxOwKMGGO4r2w8SS+4bBd20e86alA6HrXg8rGorUTQofhHytyZY5SEY/TmmEieAglWdmA6Gk9/JfTQYJ8vMVHLb3x4cW1s2kfSTXPxx1NyS4E9SJZ7n518RSYYc6mjtW0jLb1XLFZoJfEUkb705S+JUam3rKahfQJkZm8WXyA4J50wiu1DrBNuMdaT2d2kHlm51ua9gkl1q2cVglJSpLghtIZ3BjLlYxt36UVGzw2bgZBC7Y60ss7u1lGlgwA3PrWSXYWQKq4iU7/AIro+F49zc+kapI8mkEjyFZg3iA4bPep7WyeZ8KpZsHCgZpz/D/meKzuI/I8jN2xk1Bem4sXkht49LagHY9AcYPtXaGMbOwsraHPEby2jc/ySS6R/wCoyT+DXV0nBJkHy/EbQ45gyEf/AKApEbd44Jrh4/FCNjWehol7tOJ8KSBoY0W1z4bCIBsnBO/Ubd+tTrRpol6QDxOx8J9UWGU8mXdT7HrVq+HbIS8PmcW8h0x5yJQMjvS/4a4Dc8Qhl1pm1wCJWJAB7fuau3wtYx/K8RRYzp8LSPLyycZq1yQ+zzu9sSl7JlSFUjZhjGaNtf4XGwW9vIx/pXJHsQBzqwcS4FdXXCri8s9Dt9LIdyAvUY+9UuxtJYmnYRB5VTBVhuMjNTJqKtjjFvoukd18I3FssQurZJQPK0kbRkezY2/NJuM8JGlSj/MwscRyqQ+k9sjvv+KU2FxLewG2liHhA6jlOvvzouwhu7W8RoH127qWlDHIRQf+KNab0g06sTy27xOOWM4PtXsXwRC0nwrbGYHfUVzsQM1U04G13w6GQqobBJXT9+dW3hUjWtlbIpIWOMKUB7VGWGuLRIXdKrIY1U+lD+OYoTHIm/LNM4THP9KaTzIJri7tFePIr5bJ5WTBleN8Ipq0VCe5ihjYHGontU/DjBcWwkJUbnnTE/DnjhmJ8x3pZL8N3aSEREhavH5GB9sjQCXvDLjxDqU0EOHzLIPKRV1njLMSg29aFvYMJFKDpI54rozwyivwMNKchOwt7e1VAxR2UZOcUMw/wj5y23NTgVDxBTJc6pCHYkkAkg/pUyozYV02JGCcN+tdbDDTBI9C4RlrAsRV8eb2ptL8O2vGbdJWfwZgCA4x5h1BBG4oGWaONliVdWTjOMD/AGptYRzIgHi+GrHm74rVcAAxfBE9t4himRkf6lKEipLT4KhlfF1KDGh3jhACketWa3kt1j1Fy3q0L4/OMUNLdSS7hCxwfMMFR6f3n3qdqF6qNN6enSmC3yNa2wtrNI0giOmRc4x/zXHwsrpa3ixrkg4UY579/wBjRPEFxaRSajv55FA/v0/FNPhqzWKzu1YpnJIGdjkVpRmIuE+PGl3JDkCGYtoHUEb/AIrLjgPDuJSfN23+HIR9SDG/Ufnp/wB0wgSO14k0SEsjqG1Ebt3A/vrSgx/w/iUxiJDajgE558s0nFSVMak07RGvwiW1RySI2TuEfGfwKOg+DbIYe6cmGP6LdNkBHU8y33NNrS4M+SI53cYUEIuk9xliDWr2SRRqEJQnY6l049iMg/mlGEYdIcpyn+zFt0xjkEcSgIvKgCWWSRI1Pm5npXXE5mjcFQRyyT3/AK1u4l1LHKuVYjBBU8/XlT7JJOEXBW7EUrAKdgvUmrN4Ilbwwd6pQR4pS6TKSN8f0q1cFSS9jWcbOBgjPauB8v4sOMrX9HydyGSzkw5FHQNFLGGbGTQl/BJO+h9j7VJHw3QgHiEfeuDsKcnKMeAtiOJ9aahuvcUFxe4CwLDDGC2Mks2KM4Q6pZzMSNKNtVR43xJ5pSsROpic4bGR2FfXeO9yCkZwj7F5ebLGQpnUdgaIt5owrMYwAoyWB5/egPmQBsunvjfH4FcTzoIsRJKC2xO5yPavaiwmC5WbiUMcUmS7gYY4yD786uaTykhrOKdtt3WMam9idlG3Ln7V5vwWCS547AFCaATnVt0PPar/AJM4CvK0iAf4Z8RlTHcIu5Ge/OmA21TRhnFtfKCuQ9vfljjvgnH98qhtLstcxxu7zDBIbRpZupDDHPHUbHtW7EJhTCqwNnGQjaTnrk4P5rp/DhuHka5VXA8QMgHT+Yd/9Q9veqA3cyslyo3MMQEiBeq9CO+NtqbWKyRZdGyDgbbAfalqWo+ciYujQSgOiRnUqE/UF9Cd/vT5YY4wEywVTjYfVihALL5Y4dLFgZSdRI9M0u4v/wCNmeNdauRnJyA2Mrv7Ypxxu1h8DxVyDJs3f3pXxN4F4dpuitvGVXwbbV5sYwM+pAHsMUwOOGmOS3dzLJcyHoysUz2Cqyj85NdF7eNWHhzxTnl4cLRD85IqGxi8C18RyjKPpQ+VcdABUcnEnSceRxt/9Y/ak+gBOP3ifwnXneOUKCRpO+xyOQO3350DaXJksGXBBP0gnp7Cp/ii4/ifw/cMmpZ42VjjyHGf+v7NV3gTtAoRsHXtjJ/ptUAOHklWNMBcEbggirL8JcSEVzoD6tWARvgHpmqpJJjManAz5Tnn9jRPDJLu3lXzBsHKlF+n96zyxU40wPYrrhvzKB12aklxw+fxSBK21PeDcSFzw2OVyNeneqX8R/EEkHFZI4GYqB0rmeRgxKKdEqxBxTFtwtm8QJ4pzgGqNNKDLqYAIrDSTuX9qsHHp8O0J88cfJSeW/eq4hEshIiiCod+e/5r2+NDRBJmhJdTZB1Fjq3PZR2/NBzyllyzSYHJUAAqS6nxGTHpL9OuP6UvknuuSytpJ33016RDHgbSRXbu+pSEOA7E/ptVgiupGYu0zADBKgdvb2FVXhSRtfoZG8RycYTcgf1NP2kTOjQoc76SfN7k0N0xFn4TemNhIhxpwTpGGA9utWGWKx4tCgk0LPE+pJRzU49d+XevPI7qSFlMMhRcaSSNjjpk1YLDjVzFpFwHY4wQ6Aah6HGKpMBZeniPwXdzPdWxuOHSvmGaJiRH6HPKrFwH4r4fxSBpVu5Y2iX6SAeQopOM2axaHVwBjVG3nGPUD/egHuODcPlMicM4YrOcuPBA69e9MBRxX48PFbk8P4bbyTyONKdN/Xf9ab8A+GLgRR3PxBcG4ulJbBbKqegz+PxRVhJwe2kN1bWXD4ZpSd4kCt+grq64uZEHy8gk1g6RoLBvv/Smq9gEcQk8MH5eOEqMc8nH32quzOssmZCGbPOJcDPsaHv7lpF1Kf8AFbdtQ2U55E/ahPGZsLI22dmYcj6d6TYgriMmeG3JdGyVAGW5Db71VLJVhclS43z5uR+4q2XkF0eDztG2rCqfEwufYjFVVYThZG8NCeRjcDf7f91IxjJO7EFt8gaieR9c1NbXZWYGNiV6EUF4haDSBkrtjGD/AM+9GcP8N3VnKjA2IUZHvtg1LGeh/CFw9zwrTJIy6ZCNzvjpTWThFk7anUFjzJqpfDWpJSqvkMNyOvUbdKfGRgcFj+a+Y+SlLHmqrRao8w4pIZJGA0prbnp5e1LJpXijKJjRy5c8elMb91ikOCWkHMGkczg5JON+Rr6WKok2sqMhy3XmeX70Nca9OpUJGeuwA/pUnjsFK62jB/ygc61Gilo5AplkJzht1T35b/pVoQx4DCUJkdgoO4VBz9v35e9HSPnVny7EA7ADPM5oTh0qJqLSkjm7Ny/v09/SguIXrJMYzqDITn78gO3Teh9gN3YRiIiNmZzsztjb2GdtqnE4hRhr0nRmTP06TyH6UlsZYbq4bSWBQlQAdiPT0/ajLm28bwlebZF33HmP9j9fSpc0uy1jk1YVJdW7LEqoGV0Pk08yT5R9+fYZFSvLJdggykhssCSe5J+2Af0oKOyngAdGy4ZWyR1znHtzFCgTwSkAljJIWGeQ57fqPxUb8H7HtSHtvfaEHhjIAMfhuQT/ADAEf+tcx8SDRuDI2xI6jJ579s1FZ8KmuXilBKlSeS88g7/qfyaEurE21wLeVmZnUFu5O4yftS34C25DOacDADDkG0jfHLOxxuKhjn06yTpD5wQwANBtDFCvhSsS68yTnfln7jb2pPJxSNZnCjKqNIXo39/0q4ZFPoUoOJfLJ1uLKVGCkldycgg+lVG+VIbppYy8MucSgDYnv65o3hN+BayMVkCEqFXPmI6/cAj3+9D3dymGW4YyhzhWBwSM9sbH7dauyKOLMCTLI/mUZxvv9jRdkRkg7EZOKUaolPlGrqBRtk7eJluZqSkXXgF5puQMAArhvNj701lmJlbGwztVY4JcFnGy4GQFxnbpVstwZIgypsfSuV8hgllqiZHll7csGfSxOSc/el80g8EEDOWIyalvGyWYvjfoKAZm3BA0tuoHQ966yQzCx9fzXUUrqrsq4xuZCfpHT71zINEKPkEtnbsKiZiCARtnOk9aYBFs7SSaDJpUD+bqe9TX1u0shIYs8gzqJ5kfuKhtiqzB8aO/WmdwouYMJqB5gkfrSfYAfwxFFNdTxT6hIIiy9MEbH/eu+L8MurOaOeSQMjnKkHkegNcNEt4RIsngTrsT/mp/FOJ47WO9hMvhAYCMCHx3H/NRO9VouMvTHXDLq2urNGwoJ59wetQXL2MVxB4ksS5Y8z6VD4FjLxJZxw+UwEeeNBgE9NqZXnC+E3tk0UPB2t3ZhiWK28wwQT+cYrz/AOdN2zdTQ0sLyyihBE0ekDP1CqbxyO84hxaXilnHIsKssUUpGF27/cmrfHw7hcKeJF8OnUB5P/GC5+5O1APxG5gtfljZRBTlSJJRy9hVLC49E7kRddcKt+A2xuuIXHjSSQtJmTAyfQe+BVS4Dw+N/Eur5D4MQyP9b9B+9WXjgbi0kPzc8KLCulQo1Y70DGUkmitYARFES4B6+praEdKf2YylZj2vg2IDeXYnC9CT/SlIlYjw3JZc7Bs6ffFOeISBosE6pFJIOMYpA74PNTk742q6JCEXLZkYYG+O1G228hxzxnHalocKdhsQPzTGyJlRnRgHGwzvkmih2WLhzAuoKncc+xqyQsVQaZQvUjPWqZwxm1A8yuMgbYNWeCTyEhJGBP8AKRWWSFifJ5vdqRnQQQexoNyYiMn6umOVTyznWTjy8sDpQ08g1BG/PetkI4MmpdB382x5VFISuzc+9cNjbFc5HX7VQBCONQbJwPWmljd+ZRk46gUoiKsrKOfMeu3KpbaUo43X7/8AGaTQDOeHw7iTQfbO2KiMjoDuAcYByen+9TXUoeNZcnAG+B1FBiYk5GM9PX3qUOyX5u6hLPFKwbGxVq23GeJoCHuZfKdvPioFc6mGzE7motznVybnvnrTCwt+McQkJV7iU7ctXP0rFuLh11NIxbOMEk0Mv1aR32olWfRpZhn9RsP2oEFR6nU+dssOrDBpvYR/L20krrvIAAcYJx60oSRmIJ0uz/Uqn154oy9nWC2EcZxkZbHWkuwAbmXxJCPFJOd9Jz+lA7F23GzbsDtUck7s5Oo5bqDua00okD6gRkZXSNj71dAdfMHKh8D050Za3RUkA6VG4Ixnn3pci482cMeYPM0ZEfDUMy8xkY7/ALUmBYOHSBIlMjc9wQM+g3qyW0wjiA8gzv5jg1SLKU6lBJyBzPOrVBPCYE85LY82e9SyjzuSYadODnrUbuHGw2XrW5fqOTsKhBxntVok2a0N+tZkVzTA6b02HatoxBrjnXSKTnHQZPtQAwt5gRjPl6k/pXMgA82c+vegkfBHap0uNJ+sAdsZqWgOxkI7DoK5LDpWzOhHmQ4PMjbNcZjOOYpASh88/pxvRMQJOkbkbgig1lRDjcjtUqXnPSAntQAzgHhx6iBqH6VBeSeMMiUqwGw5igResh07sD9Q71Cx0kjnkHSe4ppUB1MNSlg4Yr0rSuqg8iSPLjpyrkhWwF8pxkHb9K02NGFUBsb4NUBtQfEUg79c0dGSpw2xxk9dqEt1UyqMjmN8UegQ3TNJnGDnFJgEiPwyC3lYk8zTCO4VV+kn1zUHy5ADN9LHYadj6giiVskxsW+24qR2VSdyUPLc9qgHOsrKpCN86jat1lMDQ5Vs8vtW6ygDVbUkHat1lMDksSdyaw74rKygDRODXTfSDWVlAHabqD1zUoGpDn+XOP0/c1lZSAjjY6ccwMgfipIhrkKNyCHesrKANkBC2nbAOKPtXJjB2yMnPt/3WVlJgMoGIIQEgE42PKm1lH4kAYs2STyNZWUhn//Z',
        password,
        places
    });

    try {
        await newUser.save()
    } catch (error) {
        return next(new HttpError('Something went wrong, signup failed', 500))
    }

    res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

//login the user given email and password
const loginUser = async (req, res, next) => {
    //check all the validators for errors
    const errors = validationResult(req);
    //if errors occured throw an error
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input', 422));
    }

    const { email, password } = req.body;

    let userToLogin;
    try {
        userToLogin = await User.findOne({ email: email });
    } catch (error) {
        return next(new HttpError('Something went wrong, login failed', 500));
    }


    if (userToLogin && userToLogin.password === password) {
        res.json({ message: `User ${userToLogin.name} logged in successfully` });
    } else {
        return next(new HttpError('Cannot find a user to login with those credentials', 401));
    }

}

export { getAllUsers, createUser, loginUser };