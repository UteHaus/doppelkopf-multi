FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o build

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
ENV POSTGRES_USER doppelkopf
ENV POSTGRES_PASSWORD doppelkopf
ENV POSTGRES_DB doppelkopf
ENV POSTGRES_HOST localhost

COPY --from=build-env /app/build .
ENTRYPOINT [ "dotnet", "DoppelkopfApi.dll" , "--environment=Production"]
